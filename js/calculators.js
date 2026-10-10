/**
 * Army Height and Weight Calculator - Comprehensive JavaScript Calculation Suite
 * Covers:
 * 1. Army WHtR Calculator (AR 600-9 / Directive 2026-13 Standard)
 * 2. Army Body Fat Tape Test Calculator (AR 600-9 Single & Multi-site)
 * 3. Old Army Height and Weight Screening Calculator (Table B-1 Archive)
 * 4. AFT Score Calculator (5-Event Army Fitness Test Standards)
 * 5. ABCP Progress & Timeline Calculator
 * 6. Air Force WHtR Calculator (0.550 Threshold)
 * 7. Marine Corps WHtR Calculator (0.520 Threshold)
 */

document.addEventListener('DOMContentLoaded', () => {
  initWhtrCalculator();
  initBodyFatCalculator();
  initOldHWCalculator();
  initAftCalculator();
  initAbcpCalculator();
  initAirForceCalculator();
  initMarineCorpsCalculator();
});

// Mobile Helper: Smoothly scroll to calculation results on mobile viewports
function scrollToResultOnMobile(card) {
  if (!card) return;
  if (window.innerWidth <= 1024) {
    setTimeout(() => {
      const offsetTop = card.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
    }, 60);
  }
}

/* ==========================================================================
   1. ARMY WHtR CALCULATOR (Main 2026 AR 600-9 Standard)
   ========================================================================== */
function initWhtrCalculator() {
  const form = document.getElementById('whtr-form');
  if (!form) return;

  const feetInput = document.getElementById('whtr-feet');
  const inchesInput = document.getElementById('whtr-inches');
  const totalInchesInput = document.getElementById('whtr-total-inches');
  const cmInput = document.getElementById('whtr-cm');
  const waistInput = document.getElementById('whtr-waist');
  const waistCmInput = document.getElementById('whtr-waist-cm');
  const toggleHeightModeBtn = document.getElementById('toggle-height-mode');
  const toggleUnitSystemBtn = document.getElementById('toggle-unit-system');

  const calcBtn = document.getElementById('whtr-calc-btn');
  const resetBtn = document.getElementById('whtr-reset-btn');
  const resultCard = document.getElementById('whtr-result-card');

  let isTotalInches = false;
  let isMetric = false;

  // Toggle Height Input Mode (Feet+Inches vs Total Inches)
  if (toggleHeightModeBtn) {
    toggleHeightModeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isTotalInches = !isTotalInches;
      const ftInGroup = document.getElementById('whtr-ft-in-group');
      const totalInGroup = document.getElementById('whtr-total-in-group');

      if (isTotalInches) {
        ftInGroup.style.display = 'none';
        totalInGroup.style.display = 'block';
        toggleHeightModeBtn.textContent = 'Use Feet & Inches';
        // Auto convert if feet/inches entered
        const ft = parseFloat(feetInput.value) || 0;
        const inc = parseFloat(inchesInput.value) || 0;
        if (ft > 0 || inc > 0) {
          totalInchesInput.value = (ft * 12 + inc).toFixed(1);
        }
      } else {
        ftInGroup.style.display = 'flex';
        totalInGroup.style.display = 'none';
        toggleHeightModeBtn.textContent = 'Use Total Inches';
        const total = parseFloat(totalInchesInput.value) || 0;
        if (total > 0) {
          feetInput.value = Math.floor(total / 12);
          inchesInput.value = (total % 12).toFixed(1);
        }
      }
      calculateWHtR();
    });
  }

  // Toggle Imperial vs Metric
  if (toggleUnitSystemBtn) {
    toggleUnitSystemBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isMetric = !isMetric;
      const imperialSection = document.getElementById('whtr-imperial-inputs');
      const metricSection = document.getElementById('whtr-metric-inputs');

      if (isMetric) {
        imperialSection.style.display = 'none';
        metricSection.style.display = 'block';
        toggleUnitSystemBtn.textContent = 'Switch to Imperial (Inches)';
        // Convert to Metric
        let totalIn = 0;
        if (isTotalInches) {
          totalIn = parseFloat(totalInchesInput.value) || 0;
        } else {
          totalIn = (parseFloat(feetInput.value) || 0) * 12 + (parseFloat(inchesInput.value) || 0);
        }
        if (totalIn > 0 && cmInput) {
          cmInput.value = (totalIn * 2.54).toFixed(1);
        }
        const wIn = parseFloat(waistInput.value) || 0;
        if (wIn > 0 && waistCmInput) {
          waistCmInput.value = (wIn * 2.54).toFixed(1);
        }
      } else {
        imperialSection.style.display = 'block';
        metricSection.style.display = 'none';
        toggleUnitSystemBtn.textContent = 'Switch to Metric (cm)';
        // Convert from Metric
        const cm = parseFloat(cmInput.value) || 0;
        if (cm > 0) {
          const inTotal = cm / 2.54;
          if (isTotalInches) {
            totalInchesInput.value = inTotal.toFixed(1);
          } else {
            feetInput.value = Math.floor(inTotal / 12);
            inchesInput.value = (inTotal % 12).toFixed(1);
          }
        }
        const wCm = parseFloat(waistCmInput.value) || 0;
        if (wCm > 0) {
          waistInput.value = (wCm / 2.54).toFixed(1);
        }
      }
      calculateWHtR();
    });
  }

  // Real-time calculation on input change
  const inputs = [feetInput, inchesInput, totalInchesInput, cmInput, waistInput, waistCmInput];
  inputs.forEach(inp => {
    if (inp) inp.addEventListener('input', calculateWHtR);
  });

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calculateWHtR();
      scrollToResultOnMobile(resultCard);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (resultCard) {
        resultCard.style.display = 'none';
      }
    });
  }

  function calculateWHtR() {
    let heightInches = 0;
    let waistInches = 0;

    if (isMetric) {
      const cm = parseFloat(cmInput ? cmInput.value : 0);
      const wCm = parseFloat(waistCmInput ? waistCmInput.value : 0);
      if (!cm || !wCm || cm <= 0 || wCm <= 0) return;
      heightInches = cm / 2.54;
      waistInches = wCm / 2.54;
    } else {
      if (isTotalInches) {
        heightInches = parseFloat(totalInchesInput ? totalInchesInput.value : 0);
      } else {
        const ft = parseFloat(feetInput ? feetInput.value : 0) || 0;
        const inc = parseFloat(inchesInput ? inchesInput.value : 0) || 0;
        heightInches = ft * 12 + inc;
      }
      waistInches = parseFloat(waistInput ? waistInput.value : 0);
    }

    if (!heightInches || !waistInches || heightInches < 36 || waistInches < 15) {
      return;
    }

    // Calculation per AR 600-9 Directive 2026-13:
    // WHtR = waist / height, truncated or formatted to 3 decimal places
    const ratio = waistInches / heightInches;
    const ratioFormatted = ratio.toFixed(3);
    const meetsStandard = ratio < 0.550;

    // Target waist: waist must be STRICTLY BELOW 0.550 * height
    const maxWaistAllowed = heightInches * 0.550;
    const maxWaistDisplay = (maxWaistAllowed - 0.05).toFixed(1); // strictly below
    const diff = Math.abs(waistInches - maxWaistAllowed);

    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.className = `result-card animate-fade-in ${meetsStandard ? 'is-pass' : 'is-fail'}`;

      const scoreVal = document.getElementById('whtr-score-val');
      const statusBadge = document.getElementById('whtr-status-badge');
      const targetWaistVal = document.getElementById('whtr-target-waist');
      const marginVal = document.getElementById('whtr-margin-val');
      const adviceBox = document.getElementById('whtr-advice-box');
      const gaugeMarker = document.getElementById('whtr-gauge-marker');

      if (scoreVal) scoreVal.textContent = ratioFormatted;

      if (statusBadge) {
        statusBadge.className = `result-badge ${meetsStandard ? 'pass' : 'fail'}`;
        statusBadge.innerHTML = meetsStandard
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> PASSES STANDARD`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> EXCEEDS 0.550`;
      }

      if (targetWaistVal) {
        targetWaistVal.textContent = `${maxWaistDisplay} in (${(maxWaistAllowed * 2.54).toFixed(1)} cm)`;
      }

      if (marginVal) {
        if (meetsStandard) {
          marginVal.textContent = `-${diff.toFixed(1)} in (${(diff * 2.54).toFixed(1)} cm) below limit`;
          marginVal.style.color = '#047857';
        } else {
          marginVal.textContent = `+${diff.toFixed(1)} in (${(diff * 2.54).toFixed(1)} cm) over limit`;
          marginVal.style.color = '#991b1b';
        }
      }

      // Gauge needle position
      // Range: 0.400 (0%) to 0.650 (100%), 0.550 threshold is at 60%
      if (gaugeMarker) {
        let pct = ((ratio - 0.40) / (0.65 - 0.40)) * 100;
        pct = Math.max(0, Math.min(100, pct));
        gaugeMarker.style.left = `${pct}%`;
      }

      // Advice message
      if (adviceBox) {
        if (meetsStandard) {
          if (ratio <= 0.500) {
            adviceBox.innerHTML = `<strong>Excellent Standing:</strong> Your waist-to-height ratio is ${ratioFormatted}, well below the 0.550 threshold with a solid cushion of ${diff.toFixed(1)} inches. You fully meet AR 600-9 body composition standards.`;
          } else {
            adviceBox.innerHTML = `<strong>Compliant (Caution Zone):</strong> Your ratio of ${ratioFormatted} passes the standard, but you are within ${diff.toFixed(1)} inches of the 0.550 boundary. Maintain consistent training and nutrition to keep your cushion safe.`;
          }
        } else {
          adviceBox.innerHTML = `<strong>Attention Required:</strong> Your ratio of ${ratioFormatted} is at or above the 0.550 standard. Under Army Directive 2026-13, an official assessment >= 0.550 requires a same-day confirmation measurement by a different team. If confirmed, ABCP enrollment is initiated. Note: Soldiers are protected by the ongoing 180-day review period against administrative separation.`;
        }
      }
    }
  }

  // Pre-calculate with sample defaults on load if filled
  if ((feetInput && feetInput.value) || (waistInput && waistInput.value)) {
    calculateWHtR();
  }
}

/* ==========================================================================
   2. ARMY BODY FAT CALCULATOR (AR 600-9 Tape Test - 1-Site & Multi-Site)
   ========================================================================== */
function initBodyFatCalculator() {
  const form = document.getElementById('bf-form');
  if (!form) return;

  const genderBtns = document.querySelectorAll('.bf-gender-btn');
  const methodBtns = document.querySelectorAll('.bf-method-btn');
  const ageSelect = document.getElementById('bf-age-group');
  const heightFt = document.getElementById('bf-height-ft');
  const heightIn = document.getElementById('bf-height-in');
  const weight = document.getElementById('bf-weight');
  const waist = document.getElementById('bf-waist');
  const neck = document.getElementById('bf-neck');
  const hip = document.getElementById('bf-hip');

  const neckGroup = document.getElementById('bf-neck-group');
  const hipGroup = document.getElementById('bf-hip-group');
  const resultCard = document.getElementById('bf-result-card');
  const calcBtn = document.getElementById('bf-calc-btn');
  const resetBtn = document.getElementById('bf-reset-btn');

  let currentGender = 'male';
  let currentMethod = 'multisite'; // 'single' or 'multisite'

  // Gender toggle
  genderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGender = btn.dataset.gender;
      updateFieldVisibility();
      calculateBodyFat();
    });
  });

  // Method toggle
  methodBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMethod = btn.dataset.method;
      updateFieldVisibility();
      calculateBodyFat();
    });
  });

  function updateFieldVisibility() {
    if (currentMethod === 'single') {
      if (neckGroup) neckGroup.style.display = 'none';
      if (hipGroup) hipGroup.style.display = 'none';
    } else {
      if (neckGroup) neckGroup.style.display = 'block';
      if (hipGroup) hipGroup.style.display = currentGender === 'female' ? 'block' : 'none';
    }
  }

  const allInputs = [heightFt, heightIn, weight, waist, neck, hip, ageSelect];
  allInputs.forEach(inp => {
    if (inp) inp.addEventListener('input', calculateBodyFat);
  });

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calculateBodyFat();
      scrollToResultOnMobile(resultCard);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (resultCard) resultCard.style.display = 'none';
    });
  }

  function calculateBodyFat() {
    const ft = parseFloat(heightFt ? heightFt.value : 0) || 0;
    const inc = parseFloat(heightIn ? heightIn.value : 0) || 0;
    const totalHeight = ft * 12 + inc;
    const totalWeight = parseFloat(weight ? weight.value : 0) || 0;
    const waistVal = parseFloat(waist ? waist.value : 0) || 0;
    const neckVal = parseFloat(neck ? neck.value : 0) || 0;
    const hipVal = parseFloat(hip ? hip.value : 0) || 0;
    const ageGroup = ageSelect ? ageSelect.value : '21-27';

    if (totalHeight < 48 || waistVal < 15) return;

    let bodyFatPct = 0;

    if (currentMethod === 'multisite') {
      if (currentGender === 'male') {
        if (neckVal <= 0 || waistVal <= neckVal) return;
        // AR 600-9 Male Tape Formula:
        // % BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
        bodyFatPct = 86.010 * Math.log10(waistVal - neckVal) - 70.041 * Math.log10(totalHeight) + 36.76;
      } else {
        if (neckVal <= 0 || hipVal <= 0 || (waistVal + hipVal <= neckVal)) return;
        // AR 600-9 Female Tape Formula:
        // % BF = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
        bodyFatPct = 163.205 * Math.log10(waistVal + hipVal - neckVal) - 97.684 * Math.log10(totalHeight) - 78.387;
      }
    } else {
      // 1-Site Navel Method (Directive 2023-11 DoD equation):
      if (currentGender === 'male') {
        bodyFatPct = -26.97 - (0.12 * totalHeight) + (1.99 * waistVal) - (0.0107 * (totalWeight || 170));
      } else {
        bodyFatPct = -9.15 - (0.015 * totalHeight) + (1.27 * waistVal) - (0.007 * (totalWeight || 140));
      }
    }

    bodyFatPct = Math.max(3, Math.min(60, bodyFatPct));

    // AR 600-9 Table B-2 Maximum Allowable Body Fat Limits:
    const limits = {
      'male': { '17-20': 20, '21-27': 22, '28-39': 24, '40+': 26 },
      'female': { '17-20': 30, '21-27': 32, '28-39': 34, '40+': 36 }
    };

    const maxAllowed = limits[currentGender][ageGroup] || 22;
    const passes = Math.round(bodyFatPct) <= maxAllowed;

    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.className = `result-card animate-fade-in ${passes ? 'is-pass' : 'is-fail'}`;

      const scoreVal = document.getElementById('bf-score-val');
      const maxVal = document.getElementById('bf-max-val');
      const statusBadge = document.getElementById('bf-status-badge');
      const fatMassVal = document.getElementById('bf-fat-mass');
      const leanMassVal = document.getElementById('bf-lean-mass');
      const adviceBox = document.getElementById('bf-advice-box');

      if (scoreVal) scoreVal.textContent = `${bodyFatPct.toFixed(1)}%`;
      if (maxVal) maxVal.textContent = `${maxAllowed}%`;

      if (statusBadge) {
        statusBadge.className = `result-badge ${passes ? 'pass' : 'fail'}`;
        statusBadge.innerHTML = passes
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> MEETS STANDARD`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> EXCEEDS BODY FAT LIMIT`;
      }

      if (totalWeight > 0) {
        const fatLbs = (totalWeight * (bodyFatPct / 100)).toFixed(1);
        const leanLbs = (totalWeight - fatLbs).toFixed(1);
        if (fatMassVal) fatMassVal.textContent = `${fatLbs} lbs`;
        if (leanMassVal) leanMassVal.textContent = `${leanLbs} lbs`;
      }

      if (adviceBox) {
        const diff = Math.abs(bodyFatPct - maxAllowed).toFixed(1);
        if (passes) {
          adviceBox.innerHTML = `<strong>Passes Historical AR 600-9:</strong> Your estimated body fat is ${bodyFatPct.toFixed(1)}%, which is ${diff}% below your maximum allowable standard of ${maxAllowed}%. (Note: Under current 2026 rules, WHtR has replaced this test).`;
        } else {
          adviceBox.innerHTML = `<strong>Exceeds Historical Limit:</strong> Your estimated body fat is ${bodyFatPct.toFixed(1)}%, which is ${diff}% over the age standard of ${maxAllowed}%. Under historical rules, this would trigger DA Form 5500/5501 ABCP entry.`;
        }
      }
    }
  }
}

/* ==========================================================================
   3. OLD ARMY HEIGHT AND WEIGHT SCREENING TABLE CALCULATOR (Table B-1 Archive)
   ========================================================================== */
function initOldHWCalculator() {
  const form = document.getElementById('old-hw-form');
  if (!form) return;

  const genderBtns = document.querySelectorAll('.old-gender-btn');
  const ageSelect = document.getElementById('old-age-group');
  const heightFt = document.getElementById('old-height-ft');
  const heightIn = document.getElementById('old-height-in');
  const weightInput = document.getElementById('old-weight');
  const resultCard = document.getElementById('old-hw-result-card');
  const calcBtn = document.getElementById('old-hw-calc-btn');
  const resetBtn = document.getElementById('old-hw-reset-btn');

  let currentGender = 'male';

  genderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGender = btn.dataset.gender;
      calculateOldHW();
    });
  });

  [heightFt, heightIn, weightInput, ageSelect].forEach(inp => {
    if (inp) inp.addEventListener('input', calculateOldHW);
  });

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calculateOldHW();
      scrollToResultOnMobile(resultCard);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (resultCard) resultCard.style.display = 'none';
    });
  }

  // Official AR 600-9 Table B-1 Screening Weights (Heights 58 - 80 inches)
  const screeningTable = {
    male: {
      60: { min: 100, '17-20': 132, '21-27': 136, '28-39': 139, '40+': 141 },
      61: { min: 102, '17-20': 136, '21-27': 140, '28-39': 144, '40+': 146 },
      62: { min: 103, '17-20': 141, '21-27': 144, '28-39': 148, '40+': 150 },
      63: { min: 104, '17-20': 145, '21-27': 149, '28-39': 153, '40+': 155 },
      64: { min: 105, '17-20': 150, '21-27': 154, '28-39': 158, '40+': 160 },
      65: { min: 106, '17-20': 155, '21-27': 159, '28-39': 163, '40+': 165 },
      66: { min: 107, '17-20': 160, '21-27': 163, '28-39': 168, '40+': 170 },
      67: { min: 111, '17-20': 165, '21-27': 169, '28-39': 174, '40+': 176 },
      68: { min: 115, '17-20': 170, '21-27': 174, '28-39': 179, '40+': 181 },
      69: { min: 119, '17-20': 175, '21-27': 179, '28-39': 184, '40+': 186 },
      70: { min: 123, '17-20': 180, '21-27': 185, '28-39': 189, '40+': 192 },
      71: { min: 127, '17-20': 185, '21-27': 189, '28-39': 194, '40+': 197 },
      72: { min: 131, '17-20': 190, '21-27': 195, '28-39': 200, '40+': 203 },
      73: { min: 135, '17-20': 195, '21-27': 200, '28-39': 205, '40+': 208 },
      74: { min: 139, '17-20': 201, '21-27': 206, '28-39': 211, '40+': 214 },
      75: { min: 143, '17-20': 206, '21-27': 212, '28-39': 217, '40+': 220 },
      76: { min: 147, '17-20': 212, '21-27': 217, '28-39': 223, '40+': 226 },
      77: { min: 151, '17-20': 218, '21-27': 223, '28-39': 229, '40+': 232 },
      78: { min: 155, '17-20': 223, '21-27': 229, '28-39': 235, '40+': 238 },
      79: { min: 159, '17-20': 229, '21-27': 235, '28-39': 241, '40+': 244 },
      80: { min: 163, '17-20': 234, '21-27': 240, '28-39': 247, '40+': 250 }
    },
    female: {
      58: { min: 91, '17-20': 119, '21-27': 121, '28-39': 122, '40+': 124 },
      59: { min: 94, '17-20': 123, '21-27': 125, '28-39': 126, '40+': 128 },
      60: { min: 97, '17-20': 127, '21-27': 129, '28-39': 131, '40+': 133 },
      61: { min: 100, '17-20': 131, '21-27': 133, '28-39': 135, '40+': 137 },
      62: { min: 104, '17-20': 136, '21-27': 137, '28-39': 139, '40+': 141 },
      63: { min: 107, '17-20': 140, '21-27': 142, '28-39': 144, '40+': 146 },
      64: { min: 110, '17-20': 144, '21-27': 146, '28-39': 148, '40+': 151 },
      65: { min: 114, '17-20': 149, '21-27': 151, '28-39': 153, '40+': 156 },
      66: { min: 117, '17-20': 154, '21-27': 156, '28-39': 158, '40+': 161 },
      67: { min: 121, '17-20': 159, '21-27': 161, '28-39': 163, '40+': 166 },
      68: { min: 125, '17-20': 164, '21-27': 166, '28-39': 168, '40+': 171 },
      69: { min: 128, '17-20': 168, '21-27': 171, '28-39': 174, '40+': 176 },
      70: { min: 132, '17-20': 173, '21-27': 176, '28-39': 179, '40+': 182 },
      71: { min: 136, '17-20': 178, '21-27': 181, '28-39': 184, '40+': 187 },
      72: { min: 140, '17-20': 183, '21-27': 186, '28-39': 189, '40+': 192 },
      73: { min: 144, '17-20': 188, '21-27': 191, '28-39': 195, '40+': 198 },
      74: { min: 148, '17-20': 194, '21-27': 197, '28-39': 201, '40+': 204 },
      75: { min: 152, '17-20': 199, '21-27': 202, '28-39': 206, '40+': 209 },
      76: { min: 156, '17-20': 205, '21-27': 208, '28-39': 212, '40+': 215 },
      77: { min: 160, '17-20': 210, '21-27': 213, '28-39': 218, '40+': 221 },
      78: { min: 164, '17-20': 216, '21-27': 219, '28-39': 224, '40+': 227 },
      79: { min: 168, '17-20': 221, '21-27': 225, '28-39': 230, '40+': 233 },
      80: { min: 173, '17-20': 227, '21-27': 231, '28-39': 235, '40+': 239 }
    }
  };

  function calculateOldHW() {
    const ft = parseFloat(heightFt ? heightFt.value : 0) || 0;
    const inc = parseFloat(heightIn ? heightIn.value : 0) || 0;
    const totalHeight = Math.round(ft * 12 + inc);
    const weightVal = parseFloat(weightInput ? weightInput.value : 0) || 0;
    const ageGroup = ageSelect ? ageSelect.value : '21-27';

    if (totalHeight < 58 || totalHeight > 80 || weightVal <= 50) return;

    const row = screeningTable[currentGender][totalHeight];
    if (!row) return;

    const maxWeight = row[ageGroup];
    const minWeight = row.min;
    const passes = weightVal <= maxWeight && weightVal >= minWeight;

    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.className = `result-card animate-fade-in ${passes ? 'is-pass' : 'is-fail'}`;

      const scoreVal = document.getElementById('old-max-weight');
      const statusBadge = document.getElementById('old-status-badge');
      const marginVal = document.getElementById('old-margin-val');
      const adviceBox = document.getElementById('old-advice-box');

      if (scoreVal) scoreVal.textContent = `${maxWeight} lbs (Min: ${minWeight} lbs)`;

      const diff = Math.abs(weightVal - maxWeight);

      if (statusBadge) {
        statusBadge.className = `result-badge ${passes ? 'pass' : 'fail'}`;
        statusBadge.innerHTML = passes
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> MEETS SCREENING WEIGHT`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> EXCEEDS TABLE: TAPING REQUIRED`;
      }

      if (marginVal) {
        marginVal.textContent = passes ? `-${diff} lbs below max` : `+${diff} lbs over max weight`;
      }

      if (adviceBox) {
        if (passes) {
          adviceBox.innerHTML = `<strong>Meets Screening Weight:</strong> At ${weightVal} lbs, you are within Table B-1 screening limits for a ${currentGender} soldier (${totalHeight}" tall, age ${ageGroup}). Under historical rules, you would NOT be taped.`;
        } else {
          adviceBox.innerHTML = `<strong>Taping Was Triggered:</strong> At ${weightVal} lbs, you are ${diff} lbs over the screening table limit of ${maxWeight} lbs. Under historical AR 600-9 rules, you would undergo a tape test to check body fat percentage.`;
        }
      }
    }
  }
}

/* ==========================================================================
   4. AFT SCORE CALCULATOR (Army Fitness Test 5-Event Scoring)
   ========================================================================== */
function initAftCalculator() {
  const form = document.getElementById('aft-form');
  if (!form) return;

  const mosBtns = document.querySelectorAll('.aft-mos-btn');
  const genderBtns = document.querySelectorAll('.aft-gender-btn');
  const ageInput = document.getElementById('aft-age');
  const mdlInput = document.getElementById('aft-mdl');
  const hrpInput = document.getElementById('aft-hrp');
  const sdcInput = document.getElementById('aft-sdc');
  const plkInput = document.getElementById('aft-plk');
  const tmrInput = document.getElementById('aft-tmr');

  const resultCard = document.getElementById('aft-result-card');
  const calcBtn = document.getElementById('aft-calc-btn');
  const resetBtn = document.getElementById('aft-reset-btn');

  let currentMos = 'combat'; // 'combat' (350 threshold) or 'enabling' (300 threshold)
  let currentGender = 'male';

  mosBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      mosBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMos = btn.dataset.mos;
      calculateAft();
    });
  });

  genderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGender = btn.dataset.gender;
      calculateAft();
    });
  });

  [ageInput, mdlInput, hrpInput, sdcInput, plkInput, tmrInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculateAft);
  });

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calculateAft();
      scrollToResultOnMobile(resultCard);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (resultCard) resultCard.style.display = 'none';
    });
  }

  // Helper to parse mm:ss time to total seconds
  function parseTimeToSeconds(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.trim().split(':');
    if (parts.length === 2) {
      return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
    }
    return parseFloat(timeStr) || 0;
  }

  function calculateAft() {
    const age = parseInt(ageInput ? ageInput.value : 25, 10) || 25;
    const mdl = parseFloat(mdlInput ? mdlInput.value : 0) || 0;
    const hrp = parseInt(hrpInput ? hrpInput.value : 0, 10) || 0;
    const sdcSecs = parseTimeToSeconds(sdcInput ? sdcInput.value : '');
    const plkSecs = parseTimeToSeconds(plkInput ? plkInput.value : '');
    const tmrSecs = parseTimeToSeconds(tmrInput ? tmrInput.value : '');

    if (mdl <= 0 && hrp <= 0 && sdcSecs <= 0) return;

    // 1. Deadlift (MDL) Scoring (approximate Army points curve 60-100 pts)
    // Pass floor (60 pts) = 140 lbs; Max (100 pts) = 340 lbs (Combat scale)
    let mdlPts = 0;
    if (mdl >= 340) mdlPts = 100;
    else if (mdl >= 140) mdlPts = Math.round(60 + ((mdl - 140) / 200) * 40);
    else if (mdl > 0) mdlPts = Math.max(0, Math.round((mdl / 140) * 59));

    // 2. Hand-Release Push-Up (HRP)
    // Pass floor (60 pts) = 10 reps; Max (100 pts) = 60 reps
    let hrpPts = 0;
    if (hrp >= 60) hrpPts = 100;
    else if (hrp >= 10) hrpPts = Math.round(60 + ((hrp - 10) / 50) * 40);
    else if (hrp > 0) hrpPts = Math.max(0, Math.round((hrp / 10) * 59));

    // 3. Sprint-Drag-Carry (SDC)
    // Faster is better. Pass floor (60 pts) = 3:00 (180s); Max (100 pts) = 1:33 (93s)
    let sdcPts = 0;
    if (sdcSecs > 0) {
      if (sdcSecs <= 93) sdcPts = 100;
      else if (sdcSecs <= 180) sdcPts = Math.round(100 - ((sdcSecs - 93) / 87) * 40);
      else sdcPts = Math.max(0, Math.round(60 - ((sdcSecs - 180) / 30) * 20));
    }

    // 4. Plank (PLK)
    // Hold time: longer is better. Pass floor (60 pts) = 1:30 (90s); Max (100 pts) = 3:35 (215s)
    let plkPts = 0;
    if (plkSecs > 0) {
      if (plkSecs >= 215) plkPts = 100;
      else if (plkSecs >= 90) plkPts = Math.round(60 + ((plkSecs - 90) / 125) * 40);
      else plkPts = Math.max(0, Math.round((plkSecs / 90) * 59));
    }

    // 5. 2-Mile Run (2MR)
    // Faster is better. Pass floor (60 pts) = 21:00 (1260s); Max (100 pts) = 13:30 (810s)
    let tmrPts = 0;
    if (tmrSecs > 0) {
      if (tmrSecs <= 810) tmrPts = 100;
      else if (tmrSecs <= 1260) tmrPts = Math.round(100 - ((tmrSecs - 810) / 450) * 40);
      else tmrPts = Math.max(0, Math.round(60 - ((tmrSecs - 1260) / 180) * 20));
    }

    const totalPts = mdlPts + hrpPts + sdcPts + plkPts + tmrPts;
    const reqTotal = currentMos === 'combat' ? 350 : 300;
    const passesEvents = mdlPts >= 60 && hrpPts >= 60 && sdcPts >= 60 && plkPts >= 60 && tmrPts >= 60;
    const passesTotal = totalPts >= reqTotal;
    const overallPass = passesEvents && passesTotal;

    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.className = `result-card animate-fade-in ${overallPass ? 'is-pass' : 'is-fail'}`;

      const totalVal = document.getElementById('aft-total-val');
      const statusBadge = document.getElementById('aft-status-badge');
      const mdlScore = document.getElementById('aft-mdl-score');
      const hrpScore = document.getElementById('aft-hrp-score');
      const sdcScore = document.getElementById('aft-sdc-score');
      const plkScore = document.getElementById('aft-plk-score');
      const tmrScore = document.getElementById('aft-tmr-score');
      const adviceBox = document.getElementById('aft-advice-box');

      if (totalVal) totalVal.textContent = `${totalPts} / 500`;

      if (mdlScore) mdlScore.textContent = `${mdlPts} pts`;
      if (hrpScore) hrpScore.textContent = `${hrpPts} pts`;
      if (sdcScore) sdcScore.textContent = `${sdcPts} pts`;
      if (plkScore) plkScore.textContent = `${plkPts} pts`;
      if (tmrScore) tmrScore.textContent = `${tmrPts} pts`;

      if (statusBadge) {
        statusBadge.className = `result-badge ${overallPass ? 'pass' : 'fail'}`;
        statusBadge.innerHTML = overallPass
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> PASSES AFT (${currentMos.toUpperCase()})`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> DID NOT MEET STANDARD`;
      }

      if (adviceBox) {
        if (overallPass) {
          adviceBox.innerHTML = `<strong>Congratulations!</strong> You met the 60-point floor in all 5 events and exceeded the required ${reqTotal}-point total for ${currentMos === 'combat' ? 'Combat' : 'Combat Enabling'} MOS. Note: Fitness test score is fully independent of your WHtR body composition check.`;
        } else {
          let reasons = [];
          if (!passesEvents) reasons.push('scored below 60 points in one or more events');
          if (!passesTotal) reasons.push(`total score (${totalPts}) is below the required ${reqTotal} points for your MOS category`);
          adviceBox.innerHTML = `<strong>Needs Improvement:</strong> You ${reasons.join(' and ')}. Every event must reach at least 60 points to pass.`;
        }
      }
    }
  }
}

/* ==========================================================================
   5. ABCP PROGRESS & TIMELINE CALCULATOR
   ========================================================================== */
function initAbcpCalculator() {
  const form = document.getElementById('abcp-form');
  if (!form) return;

  const currentWt = document.getElementById('abcp-current-weight');
  const targetWt = document.getElementById('abcp-target-weight');
  const currentWst = document.getElementById('abcp-current-waist');
  const targetWst = document.getElementById('abcp-target-waist');
  const monthsInput = document.getElementById('abcp-months');
  const resultCard = document.getElementById('abcp-result-card');
  const calcBtn = document.getElementById('abcp-calc-btn');

  function calculateAbcp() {
    const cWt = parseFloat(currentWt ? currentWt.value : 0) || 0;
    const tWt = parseFloat(targetWt ? targetWt.value : 0) || 0;
    const cWst = parseFloat(currentWst ? currentWst.value : 0) || 0;
    const tWst = parseFloat(targetWst ? targetWst.value : 0) || 0;

    if (cWt <= 0 || tWt <= 0) return;

    const wtToLose = Math.max(0, cWt - tWt);
    const wstToLose = Math.max(0, cWst - tWst);

    // Standard safe Army rate: 3 to 8 lbs per month
    const minMonths = (wtToLose / 8).toFixed(1);
    const safeMonths = (wtToLose / 4).toFixed(1);

    if (resultCard) {
      resultCard.style.display = 'block';
      const toLoseSpan = document.getElementById('abcp-to-lose');
      const timeSpan = document.getElementById('abcp-time-estimate');
      const adviceBox = document.getElementById('abcp-advice-box');

      if (toLoseSpan) toLoseSpan.textContent = `${wtToLose.toFixed(1)} lbs (${wstToLose.toFixed(1)}" waist)`;
      if (timeSpan) timeSpan.textContent = `${safeMonths} Months (${Math.round(safeMonths * 4.3)} Weeks)`;

      if (adviceBox) {
        adviceBox.innerHTML = `<strong>ABCP Benchmark:</strong> AR 600-9 defines satisfactory progress as losing <strong>3 to 8 pounds</strong> per month (or 1% body fat). At a healthy target rate of 1 lb/week (4 lbs/month), you will reach standard compliance in approximately ${safeMonths} months without metabolic crash.`;
      }
    }
  }

  [currentWt, targetWt, currentWst, targetWst, monthsInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculateAbcp);
  });
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calculateAbcp();
      scrollToResultOnMobile(resultCard);
    });
  }
}

/* ==========================================================================
   6. AIR FORCE / SPACE FORCE WHtR CALCULATOR (0.550 Threshold)
   ========================================================================== */
function initAirForceCalculator() {
  const form = document.getElementById('af-whtr-form');
  if (!form) return;

  const ft = document.getElementById('af-feet');
  const inc = document.getElementById('af-inches');
  const waist = document.getElementById('af-waist');
  const resultCard = document.getElementById('af-result-card');
  const calcBtn = document.getElementById('af-calc-btn');

  function calc() {
    const h = (parseFloat(ft ? ft.value : 0) || 0) * 12 + (parseFloat(inc ? inc.value : 0) || 0);
    const w = parseFloat(waist ? waist.value : 0) || 0;
    if (h < 40 || w < 15) return;

    const ratio = w / h;
    const passes = ratio < 0.550;
    const maxW = (h * 0.550 - 0.05).toFixed(1);

    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.className = `result-card animate-fade-in ${passes ? 'is-pass' : 'is-fail'}`;
      const score = document.getElementById('af-score');
      const badge = document.getElementById('af-badge');
      if (score) score.textContent = ratio.toFixed(3);
      if (badge) {
        badge.className = `result-badge ${passes ? 'pass' : 'fail'}`;
        badge.textContent = passes ? 'PASSES USAF STANDARD' : 'EXCEEDS USAF 0.550';
      }
    }
  }

  [ft, inc, waist].forEach(i => { if (i) i.addEventListener('input', calc); });
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calc();
      scrollToResultOnMobile(resultCard);
    });
  }
}

/* ==========================================================================
   7. MARINE CORPS WHtR CALCULATOR (0.520 Threshold)
   ========================================================================== */
function initMarineCorpsCalculator() {
  const form = document.getElementById('mc-whtr-form');
  if (!form) return;

  const ft = document.getElementById('mc-feet');
  const inc = document.getElementById('mc-inches');
  const waist = document.getElementById('mc-waist');
  const resultCard = document.getElementById('mc-result-card');
  const calcBtn = document.getElementById('mc-calc-btn');

  function calc() {
    const h = (parseFloat(ft ? ft.value : 0) || 0) * 12 + (parseFloat(inc ? inc.value : 0) || 0);
    const w = parseFloat(waist ? waist.value : 0) || 0;
    if (h < 40 || w < 15) return;

    // USMC uses stricter 0.520 standard
    const ratio = w / h;
    const passes = ratio < 0.520;

    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.className = `result-card animate-fade-in ${passes ? 'is-pass' : 'is-fail'}`;
      const score = document.getElementById('mc-score');
      const badge = document.getElementById('mc-badge');
      if (score) score.textContent = ratio.toFixed(3);
      if (badge) {
        badge.className = `result-badge ${passes ? 'pass' : 'fail'}`;
        badge.textContent = passes ? 'MEETS USMC 0.520 STANDARD' : 'EXCEEDS USMC 0.520';
      }
    }
  }

  [ft, inc, waist].forEach(i => { if (i) i.addEventListener('input', calc); });
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calc();
      scrollToResultOnMobile(resultCard);
    });
  }
}
