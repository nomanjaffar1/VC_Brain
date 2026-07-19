import os
from typing import List, Dict, Any
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

from backend.config.settings import settings
from backend.document_processing.ingestion import FAISS_INDEX_PATH

class AdvancedRetrievalService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        self.compressor_llm = ChatOpenAI(temperature=0, model="gpt-4o-mini", openai_api_key=settings.OPENAI_API_KEY)
    
    def get_vectorstore(self):
        if os.path.exists(FAISS_INDEX_PATH):
            return FAISS.load_local(FAISS_INDEX_PATH, self.embeddings, allow_dangerous_deserialization=True)
        return None

    def rerank_chunks(self, docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Reranker logic:
        Sorts chunks by a combination of L2 similarity score and a heuristic Source Authority multiplier.
        (e.g., direct GitHub/PitchDeck data is weighted higher than News/Twitter).
        """
        authority_weights = {
            "github": 1.2,
            "pitch_deck": 1.2,
            "linkedin": 1.1,
            "news": 0.9,
            "twitter": 0.8
        }
        
        for doc in docs:
            # Lower FAISS L2 score is better, so we divide by authority weight to improve it
            doc_type = doc["metadata"].get("doc_type", "unknown").lower()
            weight = authority_weights.get(doc_type, 1.0)
            doc["reranked_score"] = doc["similarity_score"] / weight
            
        # Sort by reranked score ascending (lower is better)
        docs.sort(key=lambda x: x["reranked_score"])
        return docs

    def hybrid_retrieval(self, query: str, founder_id: str = None, filter_metadata: Dict[str, Any] = None) -> str:
        """
        Advanced Pipeline: Query -> Hybrid -> Metadata Filter -> Reranker -> Context Compression -> Prompt
        """
        vectorstore = self.get_vectorstore()
        if not vectorstore:
            return "No relevant evidence found in the vector database."
            
        # 1 & 2. Hybrid Retrieval & Metadata Filter
        kwargs = {"k": 10} # Fetch more for reranking
        if filter_metadata:
            kwargs["filter"] = filter_metadata
            
        raw_results = vectorstore.similarity_search_with_score(query, **kwargs)
        formatted_results = [
            {"content": doc.page_content, "metadata": doc.metadata, "similarity_score": float(score)}
            for doc, score in raw_results
        ]
        
        # 3. Reranker
        reranked_results = self.rerank_chunks(formatted_results)
        
        # 4. Context Compression (Keep top 4 after reranking, then compress)
        top_chunks = reranked_results[:4]
        
        # To avoid heavy latency for every query during a 30s demo, we implement a fast 
        # heuristic compression: strip out boilerplate and enforce a hard token limit per chunk.
        # In a strict production non-demo, we'd use LLMChainExtractor here.
        context_blocks = []
        for res in top_chunks:
            # Drop terrible scores even after reranking
            if res["reranked_score"] < 1.2:
                source = res['metadata'].get('source', 'Unknown Document')
                # Fast compression: take first 500 chars to prevent context flooding
                compressed_content = res['content'][:500].strip() + ("..." if len(res['content']) > 500 else "")
                context_blocks.append(f"[Source: {source}]\n{compressed_content}")
                
        if not context_blocks:
            return "No relevant evidence found in the vector database."
            
        return "\n\n".join(context_blocks)

retrieval_service = AdvancedRetrievalService()
