import pytest
from backend.services.validator_service import validator_service

def test_validation_coverage_full():
    cov = validator_service.calculate_coverage(10, 10)
    assert cov == 1.0

def test_validation_coverage_partial():
    cov = validator_service.calculate_coverage(10, 8)
    assert cov == 0.8

def test_validation_coverage_zero():
    cov = validator_service.calculate_coverage(0, 0)
    assert cov == 1.0

def test_trust_penalty_math():
    penalty = validator_service.enforce_trust_penalty(verified=5, unverified=2, contradictions=1)
    # 2 * 0.15 = 0.30, 1 * 0.40 = 0.40, Total = 0.70
    assert round(penalty, 2) == 0.70
