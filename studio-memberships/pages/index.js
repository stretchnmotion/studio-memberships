<!DOCTYPE html>
<!-- SNM Booking v14 - over-limit rates hidden -->
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Book Your Session — Stretch N Motion</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;1,700&family=Barlow:wght@400;500&display=swap');
:root {
  --teal: #1a86a0; --teal-dark: #0f5a70; --teal-light: #e8f6fa;
  --text: #111; --text-muted: #5a6a72; --text-faint: #9ca3af;
  --border: rgba(0,0,0,0.09); --bg: #fff; --bg-surface: #f4f9fb;
  --radius: 8px; --radius-lg: 12px;
  --amber: #b45309; --amber-bg: #fffbeb; --amber-border: #fcd34d;
  --red: #b91c1c; --red-bg: #fef2f2; --red-border: #fca5a5;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; min-height: 100vh; }
body { font-family: 'Barlow', sans-serif; background: #f4f9fb; color: var(--text); }
.wrap { max-width: 640px; margin: 0 auto; padding: 1.5rem 1.25rem 4rem; }
.logo-block { margin-bottom: 2rem; display: flex; justify-content: center; }
.logo-outer { background: var(--teal); padding: 14px 18px; display: inline-block; position: relative; }
.logo-shadow { position: absolute; top: 7px; left: 7px; right: -7px; bottom: -7px; background: rgba(26,134,160,0.32); z-index: 0; }
.logo-inner { background: #fff; padding: 8px 18px 10px; position: relative; z-index: 1; }
.logo-name { font-family: 'Barlow Condensed', sans-serif; font-style: italic; font-weight: 700; font-size: 26px; color: var(--teal); line-height: 1.05; }
.logo-sub { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 10px; color: var(--teal); letter-spacing: 0.18em; margin-top: 2px; }
.logo-tagline { font-size: 11px; color: rgba(255,255,255,0.85); margin-top: 7px; letter-spacing: 0.04em; text-align: center; }
.step-bar { display: flex; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); margin-bottom: 2rem; }
.step { flex: 1; padding: 9px 6px; font-size: 10px; display: flex; align-items: center; gap: 5px; color: var(--text-faint); background: #fff; border-right: 1px solid var(--border); }
.step:last-child { border-right: none; }
.step.active { background: var(--teal-dark); color: #7de8ef; }
.step.done { background: var(--teal-light); color: var(--teal); }
.step-n { width: 16px; height: 16px; border-radius: 50%; border: 1px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 500; flex-shrink: 0; }
.step.active .step-n { background: #7de8ef; color: var(--teal-dark); border-color: #7de8ef; }
.step.done .step-n { background: var(--teal); color: #fff; border-color: var(--teal); }
.sec-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.65rem; }
.card { background: var(--bg); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 1.1rem; margin-bottom: 1.25rem; }
.loc-row { display: flex; gap: 8px; margin-bottom: 1.25rem; }
.loc-btn { flex: 1; padding: 14px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); cursor: pointer; text-align: left; transition: border-color 0.15s; font-family: 'Barlow', sans-serif; }
.loc-btn:hover { border-color: var(--teal); }
.loc-btn.sel { border: 2px solid var(--teal); background: var(--teal-light); }
.loc-name { font-size: 14px; font-weight: 500; color: var(--text); }
.loc-addr { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.notice { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; padding: 10px 12px; border-radius: var(--radius); margin-bottom: 0.85rem; line-height: 1.6; }
.notice.amber { color: var(--amber); background: var(--amber-bg); border: 1px solid var(--amber-border); }
.notice.red { color: var(--red); background: var(--red-bg); border: 1px solid var(--red-border); }
.notice.teal { color: var(--teal-dark); background: var(--teal-light); border: 1px solid var(--teal); }
.notice-icon { flex-shrink: 0; margin-top: 1px; }
.hint { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--text-muted); padding: 8px 12px; background: var(--bg-surface); border-radius: var(--radius); border: 1px solid var(--border); margin-bottom: 0.85rem; line-height: 1.5; }
.hint-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); flex-shrink: 0; margin-top: 4px; }
.t-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 8px; margin-bottom: 1.25rem; }
.t-card { border-radius: var(--radius-lg); border: 1px solid var(--border); background: var(--bg); padding: 0.9rem; cursor: pointer; transition: border-color 0.15s, transform 0.1s; position: relative; user-select: none; }
.t-card:hover:not(.maxed) { border-color: var(--teal); transform: translateY(-1px); }
.t-card.sel1 { border: 2px solid var(--teal); background: var(--teal-light); }
.t-card.sel2 { border: 2px solid var(--teal-dark); background: var(--teal-light); }
.t-card.sel3 { border: 2px solid #0a7d5c; background: #ecfdf5; }
.t-card.maxed { opacity: 0.3; pointer-events: none; }
.t-av { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; margin-bottom: 8px; }
.t-name { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
.t-spec { font-size: 10px; color: var(--text-muted); line-height: 1.4; }
.t-badge { position: absolute; top: 7px; right: 7px; font-size: 9px; font-weight: 500; padding: 2px 6px; border-radius: 99px; }
.b1 { background: var(--teal); color: #fff; }
.b2 { background: var(--teal-dark); color: #7de8ef; }
.b3 { background: #0a7d5c; color: #fff; }
.sel-bar { display: flex; align-items: center; gap: 8px; background: var(--bg-surface); border-radius: var(--radius); padding: 11px 14px; margin-bottom: 1.25rem; border: 1px solid var(--border); min-height: 52px; }
.sel-slot { flex: 1; }
.sel-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-faint); margin-bottom: 2px; }
.sel-name { font-size: 12px; font-weight: 500; color: var(--text); }
.sel-empty { font-size: 11px; color: var(--text-faint); font-style: italic; }
.sel-div { width: 1px; height: 32px; background: var(--border); flex-shrink: 0; }
.btn-row { display: flex; gap: 10px; margin-top: 0.5rem; }
.btn-p { flex: 1; padding: 13px; background: var(--teal-dark); color: #7de8ef; border: none; border-radius: var(--radius); font-size: 13px; font-weight: 500; font-family: 'Barlow', sans-serif; cursor: pointer; transition: background 0.15s; }
.btn-p:hover:not(:disabled) { background: #0a3f52; }
.btn-p:disabled { opacity: 0.3; cursor: not-allowed; }
.btn-s { padding: 13px 18px; background: transparent; color: var(--text-muted); border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; font-family: 'Barlow', sans-serif; cursor: pointer; }
.btn-s:hover { background: var(--bg-surface); }
.page { display: none; }
.page.active { display: block; }
.dur-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 1.25rem; }
.dur-btn { padding: 16px 10px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); cursor: pointer; text-align: center; transition: border-color 0.15s; font-family: 'Barlow', sans-serif; }
.dur-btn:hover { border-color: var(--teal); }
.dur-btn.sel { border: 2px solid var(--teal); background: var(--teal-light); }
.dur-min { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 700; color: var(--text); }
.dur-label { font-size: 10px; color: var(--text-muted); margin-top: 3px; }
.dur-tag { font-size: 9px; font-weight: 500; padding: 2px 6px; border-radius: 99px; margin-top: 5px; display: inline-block; }
.tag-std { background: var(--teal-light); color: var(--teal); }
.tag-addon { background: var(--amber-bg); color: var(--amber); }
.addon-row { display: flex; gap: 8px; margin-bottom: 1.25rem; }
.addon-btn { flex: 1; padding: 12px 14px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); cursor: pointer; text-align: left; transition: border-color 0.15s; font-family: 'Barlow', sans-serif; }
.addon-btn:hover { border-color: var(--teal); }
.addon-btn.sel { border: 2px solid var(--teal); background: var(--teal-light); }
.addon-name { font-size: 12px; font-weight: 500; color: var(--text); }
.addon-desc { font-size: 10px; color: var(--text-muted); margin-top: 2px; }
.cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; }
.cal-nav-btn { padding: 6px 13px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); cursor: pointer; font-size: 12px; color: var(--text-muted); font-family: 'Barlow', sans-serif; }
.cal-nav-btn:hover { border-color: var(--teal); }
.cal-month { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 600; color: var(--text); }
.date-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 1.25rem; }
.date-hdr { text-align: center; font-size: 9px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 4px; }
.date-btn { padding: 9px 3px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); cursor: pointer; text-align: center; transition: border-color 0.15s; font-family: 'Barlow', sans-serif; }
.date-btn:hover:not(.unavail):not(.empty):not(.closed) { border-color: var(--teal); }
.date-btn.sel { border: 2px solid var(--teal); background: var(--teal-light); }
.date-btn.unavail { opacity: 0.22; pointer-events: none; }
.date-btn.empty { border-color: transparent; background: transparent; pointer-events: none; }
.date-btn.today { border-color: #7de8ef; }
.date-btn.closed { opacity: 0.15; pointer-events: none; background: #f0f0f0; }
.date-num { font-size: 13px; color: var(--text); }
.date-closed-lbl { font-size: 8px; color: var(--text-faint); margin-top: 1px; }
.time-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 7px; margin-bottom: 1.25rem; }
.time-btn { padding: 11px 6px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); cursor: pointer; text-align: center; font-size: 12px; font-weight: 500; color: var(--text); font-family: 'Barlow', sans-serif; transition: border-color 0.15s; }
.time-btn:hover { border-color: var(--teal); }
.time-btn.sel { border: 2px solid var(--teal); color: var(--teal); background: var(--teal-light); }
.time-sub { font-size: 9px; color: var(--text-muted); margin-top: 3px; font-weight: 400; line-height: 1.4; }
.loading { text-align: center; padding: 2rem; font-size: 12px; color: var(--text-muted); }
.loading-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--teal); margin: 0 2px; animation: pulse 1.2s ease-in-out infinite; }
.loading-dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes pulse { 0%,80%,100%{opacity:0.2;}40%{opacity:1;} }
.form-group { margin-bottom: 0.85rem; }
.form-label { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; display: block; }
.form-input { width: 100%; padding: 10px 12px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); font-size: 13px; color: var(--text); font-family: 'Barlow', sans-serif; outline: none; }
.form-input[readonly] { background: var(--bg-surface); color: var(--text-muted); cursor: default; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sum-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 12px; gap: 12px; }
.sum-row:last-child { border-bottom: none; }
.sum-lbl { color: var(--text-muted); flex-shrink: 0; }
.sum-val { font-weight: 500; color: var(--text); text-align: right; }
.consent-box { background: var(--bg-surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 11px 13px; margin-bottom: 0.85rem; }
.consent-box p { font-size: 11px; color: var(--text-muted); line-height: 1.6; }
.checkbox-row { display: flex; align-items: flex-start; gap: 8px; margin-top: 9px; }
.checkbox-row input { margin-top: 2px; accent-color: var(--teal); flex-shrink: 0; }
.checkbox-row label { font-size: 11px; color: var(--text-muted); line-height: 1.5; cursor: pointer; }
.error-msg { font-size: 12px; color: var(--red); padding: 9px 13px; background: var(--red-bg); border: 1px solid var(--red-border); border-radius: var(--radius); margin-bottom: 0.85rem; display: none; }
.error-msg.show { display: block; }
.no-times { text-align: center; padding: 1.5rem; font-size: 12px; color: var(--text-muted); }
.gate-wrap { text-align: center; padding: 3rem 1rem; }
.gate-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--teal-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
.gate-title { font-family: 'Barlow Condensed', sans-serif; font-style: italic; font-weight: 700; font-size: 24px; color: var(--text); margin-bottom: 0.5rem; }
.gate-sub { font-size: 13px; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem; }
.welcome-banner { background: var(--teal-dark); border-radius: var(--radius); padding: 12px 16px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.welcome-name { font-size: 14px; font-weight: 500; color: #7de8ef; }
.welcome-sub { font-size: 11px; color: rgba(125,232,239,0.7); margin-top: 1px; }
.session-pill { font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 99px; background: rgba(125,232,239,0.15); color: #7de8ef; white-space: nowrap; }
.session-pill.over { background: rgba(252,211,77,0.2); color: #fcd34d; }
.success-wrap { text-align: center; padding: 3rem 1rem; }
.success-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--teal-dark); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
.success-title { font-family: 'Barlow Condensed', sans-serif; font-style: italic; font-weight: 700; font-size: 28px; color: var(--text); margin-bottom: 0.5rem; }
.success-sub { font-size: 13px; color: var(--text-muted); line-height: 1.7; max-width: 380px; margin: 0 auto; }

.any-avail-btn { width: 100%; padding: 14px 16px; border-radius: var(--radius); border: 2px dashed var(--border); background: var(--bg); cursor: pointer; text-align: left; transition: border-color 0.15s, background 0.15s; margin-bottom: 0.85rem; font-family: 'Barlow', sans-serif; }
.any-avail-btn:hover { border-color: var(--teal); background: var(--teal-light); }
.any-avail-btn.sel { border-color: var(--teal); background: var(--teal-light); border-style: solid; }
.any-avail-name { font-size: 13px; font-weight: 500; color: var(--text); }
.any-avail-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
</style>

<div class="wrap">
  <div class="logo-block">
    <div class="logo-outer">
      <div class="logo-shadow"></div>
      <div class="logo-inner">
        <div class="logo-name">STRETCH N<br>MOTION</div>
        <div class="logo-sub">MOBILITY STUDIO</div>
      </div>
      <div class="logo-tagline">Member Booking Portal</div>
    </div>
  </div>

  <div id="gate" style="display:none">
    <div class="gate-wrap">
      <div class="gate-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 2 5 5 5 9V10H4C3.4 10 3 10.4 3 11V21C3 21.6 3.4 22 4 22H20C20.6 22 21 21.6 21 21V11C21 10.4 20.6 10 20 10H19V9C19 5 16 2 12 2ZM12 4C14.8 4 17 6.2 17 9V10H7V9C7 6.2 9.2 4 12 4ZM12 14C12.6 14 13 14.4 13 15C13 15.6 12.6 16 12 16C11.4 16 11 15.6 11 15C11 14.4 11.4 14 12 14Z" fill="#7de8ef"/></svg></div>
      <div class="gate-title">Members Only</div>
      <div class="gate-sub">This booking portal is for active Stretch N Motion members only. Please use the personal link sent to you when you joined.<br><br>Need help? <strong>stretchnmotion@gmail.com</strong></div>

    </div>
  </div>

  <div id="suspended" style="display:none">
    <div class="gate-wrap">
      <div class="gate-icon" style="background:var(--red)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19H22L12 2ZM12 16C11.4 16 11 15.6 11 15C11 14.4 11.4 14 12 14C12.6 14 13 14.4 13 15C13 15.6 12.6 16 12 16ZM11 13V9H13V13H11Z" fill="#fff"/></svg></div>
      <div class="gate-title" style="color:var(--red)">Booking Access Suspended</div>
      <div class="gate-sub">Your booking access has been temporarily suspended. Please contact us.<br><br><strong>stretchnmotion@gmail.com</strong></div>
    </div>
  </div>

  <!-- NON-MEMBER FLOW -->
  <div id="nonmember" style="display:none">
    <div class="welcome-banner" style="background:var(--teal)">
      <div>
        <div class="welcome-name" id="nm-welcome-name">Single Session Booking</div>
        <div class="welcome-sub">Assisted stretch & bodywork session</div>
      </div>
    </div>

    <div class="step-bar">
      <div class="step active" id="nm-s1"><div class="step-n">1</div><span>Details</span></div>
      <div class="step" id="nm-s2"><div class="step-n">2</div><span>Therapist</span></div>
      <div class="step" id="nm-s3"><div class="step-n">3</div><span>Date & Time</span></div>
      <div class="step" id="nm-s4"><div class="step-n">4</div><span>Confirm</span></div>
    </div>

    <div class="page active" id="nm-page1">
      <div class="notice amber"><span class="notice-icon">&#9888;</span><span>24-hour cancellation notice required. Late cancellations are non-refundable.</span></div>
      <div class="sec-label">Your details</div>
      <div class="card">
        <div class="form-row">
          <div class="form-group"><label class="form-label">First name</label><input class="form-input" type="text" id="nm-first" placeholder="First name"></div>
          <div class="form-group"><label class="form-label">Last name</label><input class="form-input" type="text" id="nm-last" placeholder="Last name"></div>
        </div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="nm-email" placeholder="your@email.com"></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" type="tel" id="nm-phone" placeholder="(555) 000-0000"></div>
      </div>
      <div class="error-msg" id="nm-error1">Please fill in all fields.</div>
      <div class="btn-row">
        <button class="btn-s" onclick="document.getElementById('nonmember').style.display='none';document.getElementById('gate').style.display='block'">Back</button>
        <button class="btn-p" onclick="nmGoTo(2)">Continue</button>
      </div>
    </div>

    <div class="page" id="nm-page2">
      <div class="sec-label">Your location</div>
      <div class="loc-row">
        <button class="loc-btn" id="nm-loc-braintree" onclick="nmSelectLocation(this,'braintree')"><div class="loc-name">Braintree</div><div class="loc-addr">89 Hancock St, Suite 101</div></button>
        <button class="loc-btn" id="nm-loc-weymouth" onclick="nmSelectLocation(this,'weymouth')"><div class="loc-name">Weymouth</div><div class="loc-addr">174 Middle Street</div></button>
      </div>
      <div id="nm-therapist-section" style="display:none">
        <div class="sec-label">Choose a therapist</div>
        <div class="hint"><div class="hint-dot"></div><span id="nm-hint-text">Select 1 therapist for your 50-min session.</span></div>
        <button class="any-avail-btn" id="nm-any-avail-btn" onclick="nmSelectAnyAvailable()">
          <div class="any-avail-name">⚡ Any Available</div>
          <div class="any-avail-sub">First available therapist at this location</div>
        </button>
        <div class="t-grid" id="nm-t-grid"></div>
      </div>
      <div class="btn-row">
        <button class="btn-s" onclick="nmGoTo(1)">Back</button>
        <button class="btn-p" id="nm-btn2" disabled onclick="nmGoTo(3)">Continue</button>
      </div>
    </div>

    <div class="page" id="nm-page3">
      <div class="sec-label">Pick a date</div>
      <div class="cal-nav">
        <button class="cal-nav-btn" onclick="nmPrevMonth()">&#8592; Prev</button>
        <div class="cal-month" id="nm-cal-month"></div>
        <button class="cal-nav-btn" onclick="nmNextMonth()">Next &#8594;</button>
      </div>
      <div class="date-grid" id="nm-date-grid"></div>
      <div id="nm-time-section" style="display:none">
        <div class="sec-label">Available times</div>
        <div id="nm-time-container"></div>
      </div>
      <div class="btn-row">
        <button class="btn-s" onclick="nmGoTo(2)">Back</button>
        <button class="btn-p" id="nm-btn3" disabled onclick="nmGoTo(4)">Continue</button>
      </div>
    </div>

    <div class="page" id="nm-page4">
      <div class="notice amber"><span class="notice-icon">&#9888;</span><span>24-hour cancellation required. Late cancellations are non-refundable. Payment is collected in studio.</span></div>
      <div class="sec-label">Booking summary</div>
      <div class="card" id="nm-summary"></div>
      <div class="consent-box">
        <p>I consent to participate in assisted stretching/massage therapy with Stretch N Motion for improving flexibility, relaxation, and muscular tension relief. I understand this is not a substitute for medical treatment. I agree to hold harmless Stretch N Motion and its staff from any claims arising from this program.</p>
        <div class="checkbox-row"><input type="checkbox" id="nm-consent1"><label for="nm-consent1">I have read and agree to the consent terms</label></div>
      </div>
      <div class="consent-box">
        <p>Cancellations require 24 hours notice. Late cancellations and no-shows are non-refundable. Payment of $95 is due in studio at time of session.</p>
        <div class="checkbox-row"><input type="checkbox" id="nm-consent2"><label for="nm-consent2">I understand the cancellation and payment policy</label></div>
      </div>
      <div class="error-msg" id="nm-error4">Please agree to both policies before confirming.</div>
      <div class="btn-row">
        <button class="btn-s" onclick="nmGoTo(3)">Back</button>
        <button class="btn-p" id="nm-btn4" onclick="nmSubmit()">Confirm booking</button>
      </div>
    </div>

    <div class="page" id="nm-page5">
      <div class="success-wrap">
        <div class="success-icon"><svg width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M6 14L11 19L22 8" stroke="#7de8ef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="success-title">You're booked!</div>
        <div class="success-sub" id="nm-success-msg"></div>
      </div>
    </div>
  </div>

  <div id="app" style="display:none">
    <div class="welcome-banner">
      <div>
        <div class="welcome-name" id="welcome-name"></div>
        <div class="welcome-sub" id="welcome-sub">Active member · booking portal</div>
      </div>
      <div class="session-pill" id="session-pill"></div>
    </div>

    <div class="step-bar">
      <div class="step active" id="s1"><div class="step-n">1</div><span>Therapists</span></div>
      <div class="step" id="s2"><div class="step-n">2</div><span>Session</span></div>
      <div class="step" id="s3"><div class="step-n">3</div><span>Date & Time</span></div>
      <div class="step" id="s4"><div class="step-n">4</div><span>Confirm</span></div>
    </div>

    <!-- PAGE 1 -->
    <div class="page active" id="page1">
      <div class="notice amber"><span class="notice-icon">&#9888;</span><span>A card on file is required for all bookings. No-shows are subject to automatic charge. 12-hour cancellation notice required.</span></div>
      <div class="sec-label">Your location</div>
      <div class="loc-row">
        <button class="loc-btn" onclick="selectLocation(this,'braintree')"><div class="loc-name">Braintree</div><div class="loc-addr">89 Hancock St, Suite 101</div></button>
        <button class="loc-btn" onclick="selectLocation(this,'weymouth')"><div class="loc-name">Weymouth</div><div class="loc-addr">174 Middle Street</div></button>
      </div>
      <div id="therapist-section" style="display:none">
        <div class="sec-label">Choose up to 3 therapists</div>
        <div class="hint"><div class="hint-dot"></div><span id="hint-text">Select 1, 2, or 3 therapists. The system finds the best available back-to-back slots.</span></div>
        <button class="any-avail-btn" id="any-avail-btn" onclick="selectAnyAvailable()">
          <div class="any-avail-name">⚡ Any Available</div>
          <div class="any-avail-sub">First available therapist at this location</div>
        </button>
        <div class="t-grid" id="t-grid"></div>
        <div class="sec-label">Your selection</div>
        <div class="sel-bar">
          <div class="sel-slot" id="slot1"><div class="sel-lbl">First</div><div class="sel-empty">Not selected</div></div>
          <div class="sel-div"></div>
          <div class="sel-slot" id="slot2"><div class="sel-lbl">Second</div><div class="sel-empty">Optional</div></div>
          <div class="sel-div"></div>
          <div class="sel-slot" id="slot3"><div class="sel-lbl">Third</div><div class="sel-empty">Optional</div></div>
        </div>
        <div class="btn-row">
          <button class="btn-s" onclick="resetLocation()">Back</button>
          <button class="btn-p" id="btn1" disabled onclick="goTo(2)">Continue</button>
        </div>
      </div>
    </div>

    <!-- PAGE 2 -->
    <div class="page" id="page2">
      <div class="sec-label">Session length</div>
      <div id="over-limit-notice" style="display:none" class="notice amber">
        <span class="notice-icon">&#9888;</span>
        <span id="over-limit-text"></span>
      </div>
      <div class="notice amber" id="addon-info" style="display:none"><span class="notice-icon">&#9888;</span><span>Add-on time beyond your standard session is billed separately by staff after your visit.</span></div>
      <div class="dur-grid">
        <button class="dur-btn" onclick="selectDuration(this,25,1)"><div class="dur-min">25</div><div class="dur-label">minutes</div><div class="dur-tag tag-std">1 slot</div></button>
        <button class="dur-btn" onclick="selectDuration(this,50,2)"><div class="dur-min">50</div><div class="dur-label">minutes</div><div class="dur-tag tag-std">Standard · 2 slots</div></button>
        <button class="dur-btn" onclick="selectDuration(this,75,3)"><div class="dur-min">75</div><div class="dur-label">minutes</div><div class="dur-tag tag-addon">+25 · 3 slots</div></button>
        <button class="dur-btn" onclick="selectDuration(this,100,4)"><div class="dur-min">100</div><div class="dur-label">minutes</div><div class="dur-tag tag-addon">+50 · 4 slots</div></button>
      </div>

      <div class="btn-row">
        <button class="btn-s" onclick="goTo(1)">Back</button>
        <button class="btn-p" id="btn2" disabled onclick="goTo(3)">Continue</button>
      </div>
    </div>

    <!-- PAGE 3 -->
    <div class="page" id="page3">
      <div class="sec-label">Pick a date</div>
      <div class="cal-nav">
        <button class="cal-nav-btn" onclick="prevMonth()">&#8592; Prev</button>
        <div class="cal-month" id="cal-month"></div>
        <button class="cal-nav-btn" onclick="nextMonth()">Next &#8594;</button>
      </div>
      <div class="date-grid" id="date-grid"></div>
      <div id="time-section" style="display:none">
        <div class="sec-label" id="time-label">Available times</div>
        <div id="time-container"></div>
      </div>
      <div class="btn-row">
        <button class="btn-s" onclick="goTo(2)">Back</button>
        <button class="btn-p" id="btn3" disabled onclick="goTo(4)">Continue</button>
      </div>
    </div>

    <!-- PAGE 4 -->
    <div class="page" id="page4">
      <div class="sec-label">Your details</div>
      <div class="card">
        <div class="form-row">
          <div class="form-group"><label class="form-label">First name</label><input class="form-input" type="text" id="f-first" readonly></div>
          <div class="form-group"><label class="form-label">Last name</label><input class="form-input" type="text" id="f-last" readonly></div>
        </div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" id="f-email" readonly></div>
        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" type="tel" id="f-phone" readonly></div>
      </div>
      <div id="billing-notice" style="display:none" class="notice amber">
        <span class="notice-icon">&#9888;</span>
        <span id="billing-notice-text"></span>
      </div>
      <div class="notice amber"><span class="notice-icon">&#9888;</span><span>A card on file is required. No-shows will be automatically charged. 12-hour cancellation notice required.</span></div>
      <div class="sec-label">Booking summary</div>
      <div class="card" id="summary"></div>
      <div class="consent-box">
        <p>I consent to participate in assisted stretching/massage therapy with Stretch N Motion for improving flexibility, relaxation, and muscular tension relief. I understand this is not a substitute for medical treatment. I agree to hold harmless Stretch N Motion and its staff from any claims arising from this program.</p>
        <div class="checkbox-row"><input type="checkbox" id="consent1"><label for="consent1">I have read and agree to the consent terms</label></div>
      </div>
      <div class="consent-box">
        <p>A 12-hour notice is required to cancel. No-shows will be charged as a full session. Late arrival may result in a shortened session. Repeated no-shows or non-payment of add-ons may result in restricted booking access.</p>
        <div class="checkbox-row"><input type="checkbox" id="consent2"><label for="consent2">I understand and agree to the cancellation and payment policy</label></div>
      </div>
      <div id="over-consent-box" style="display:none" class="consent-box" style="border-color:var(--amber-border)">
        <p style="color:var(--amber)">This session exceeds your monthly membership limit. Staff will process an additional session charge to your card on file after your visit.</p>
        <div class="checkbox-row"><input type="checkbox" id="consent3"><label for="consent3">I understand this session will be billed as an over-limit add-on by staff after my visit</label></div>
      </div>
      <div class="error-msg" id="error-msg">Please agree to all policies before confirming.</div>
      <div class="btn-row">
        <button class="btn-s" onclick="goTo(3)">Back</button>
        <button class="btn-p" id="btn4" onclick="submitBooking()">Confirm booking</button>
      </div>
    </div>

    <!-- PAGE 5 -->
    <div class="page" id="page5">
      <div class="success-wrap">
        <div class="success-icon"><svg width="26" height="26" viewBox="0 0 28 28" fill="none"><path d="M6 14L11 19L22 8" stroke="#7de8ef" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="success-title">You're booked!</div>
        <div class="success-sub" id="success-msg"></div>
        <button class="btn-p" onclick="resetAndBookAgain()" style="max-width:240px;margin:1.5rem auto 0;display:block">Book another session</button>
      </div>
    </div>
  </div>
</div>

<script>
const PROXY = 'https://snm-booking-api.vercel.app';
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const MEMBERSHIP_TYPES = { '4x': 43687655, '8x': 43688103, '16x': 43688572 };
const MEMBERSHIP_LIMITS = { '4x': 4, '8x': 8, '16x': 16 };
const OVERLIMIT_RATES = { '4x': 50, '8x': 45, '16x': 40 };

const THERAPISTS = {
  braintree: [
    { id: 8503778,  name: "Andrew Kelly",    spec: "Lead Stretch · Lower Body & Scapular",          initials: "AK", bg: "#1a2e2f", fg: "#7de8ef" },
    { id: 8164771,  name: "Charles Lunney",  spec: "Lead Massage · Sports Injury & Cervical Spine", initials: "CL", bg: "#2e2a1a", fg: "#f0d4a8" },

    { id: 12173480, name: "Drew O'Leary",    spec: "Legs & Lower Back Specialist",                  initials: "DO", bg: "#2a1a3a", fg: "#c4a8f0" },
    { id: 8884184,  name: "Maria Colantoni", spec: "Massage Therapist · Neck & Shoulder",           initials: "MC", bg: "#3a1a1a", fg: "#f0a8a8" },
    { id: 12211897, name: "Tricia Hayes",    spec: "Assisted Stretch · Shoulder Mobility",          initials: "TH", bg: "#1a2e3a", fg: "#a8d4f0" },
    { id: 14156763, name: "Jodany Pierre",   spec: "Assisted Stretch Therapist",                   initials: "JP", bg: "#2a1a2e", fg: "#d4a8f0" },
  ],
  weymouth: [
    { id: 12293959, name: "Tricia Hayes",    spec: "Assisted Stretch · Shoulder Mobility",          initials: "TH", bg: "#1a2e3a", fg: "#a8d4f0" },
    { id: 12172902, name: "Maria Colantoni", spec: "Lead Massage · Neck & Shoulder",                initials: "MC", bg: "#3a1a1a", fg: "#f0a8a8" },
    { id: 11000889, name: "Drew O'Leary",    spec: "Assisted Stretch · Legs & Lower Back",          initials: "DO", bg: "#2a1a3a", fg: "#c4a8f0" },
    { id: 12824261, name: "Charles Lunney",  spec: "Sports Massage Therapist",                      initials: "CL", bg: "#2e2a1a", fg: "#f0d4a8" },

    { id: 14128727, name: "Jodany Pierre",   spec: "Assisted Stretch Therapist",                   initials: "JP", bg: "#1a2e3a", fg: "#a8d4f0" },
  ]
};

let client = null;
let state = {
  location: null, selected: [], anyAvailable: false, duration: null, numSlots: null,
  addons: [], date: null, timeSlot: null,
  calYear: new Date().getFullYear(), calMonth: new Date().getMonth(),
  availableDates: [], timeSlots: [],
  isOverLimit: false, bookingMonth: null
};

// ── Auth + Session Check ──────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const code = (params.get('code') || '').toUpperCase().trim();
  if (!code) { document.getElementById('gate').style.display = 'block'; return; }
  try {
    const r = await fetch(`${PROXY}/api/clients?code=${code}`);
    if (!r.ok) { document.getElementById('gate').style.display = 'block'; return; }
    const c = await r.json();
    if (!c.active) { document.getElementById('suspended').style.display = 'block'; return; }

    // Guest/non-member flow
    if (c.membership === 'guest') {
      document.getElementById('nonmember').style.display = 'block';
      // Pre-fill guest details
      document.getElementById('nm-first').value = c.first;
      document.getElementById('nm-last').value = c.last;
      document.getElementById('nm-email').value = c.email;
      document.getElementById('nm-phone').value = c.phone;
      // Store guest client for use in booking
      window.guestClient = c;
      return;
    }

    // Member flow
    client = c;
    document.getElementById('app').style.display = 'block';
    document.getElementById('welcome-name').textContent = `Welcome back, ${c.first}!`;
    document.getElementById('f-first').value = c.first;
    document.getElementById('f-last').value = c.last;
    document.getElementById('f-email').value = c.email;
    document.getElementById('f-phone').value = c.phone;

    // Show session status in welcome banner
    const used = c.sessionsUsed || 0;
    const limit = c.sessionsLimit || MEMBERSHIP_LIMITS[c.membership] || 4;
    const remaining = Math.max(0, limit - used);
    const pill = document.getElementById('session-pill');
    const now = new Date();
    const monthName = MONTHS_SHORT[now.getMonth()];
    if (used >= limit) {
      pill.textContent = `${monthName}: ${used}/${limit} — over limit`;
      pill.classList.add('over');
    } else {
      pill.textContent = `${monthName}: ${remaining} session${remaining !== 1 ? 's' : ''} left`;
    }
  } catch(e) { document.getElementById('gate').style.display = 'block'; }
});

// ── Navigation ────────────────────────────────────────
function api(endpoint, params = {}) {
  const qs = new URLSearchParams({ endpoint, ...params }).toString();
  return fetch(`${PROXY}/api/acuity?${qs}`).then(r => r.json());
}

function goTo(n) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page' + n).classList.add('active');
  for (let i = 1; i <= 4; i++) {
    const s = document.getElementById('s' + i);
    s.classList.remove('active', 'done');
    if (i < n) s.classList.add('done');
    else if (i === n) s.classList.add('active');
  }
  if (n === 2) checkOverLimit();
  if (n === 3) initCalendar();
  if (n === 4) buildSummary();
}

// ── Page 1 ────────────────────────────────────────────
function selectLocation(btn, loc) {
  document.querySelectorAll('.loc-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  state.location = loc; state.selected = []; state.anyAvailable = false;
  document.getElementById('therapist-section').style.display = 'block';
  const anyBtn = document.getElementById('any-avail-btn');
  if (anyBtn) anyBtn.classList.remove('sel');
  renderGrid(); updateSelBar();
}

function resetLocation() {
  document.querySelectorAll('.loc-btn').forEach(b => b.classList.remove('sel'));
  state.location = null; state.selected = [];
  document.getElementById('therapist-section').style.display = 'none';
}

function selectAnyAvailable() {
  // Toggle — if already in any-available mode, deselect
  const btn = document.getElementById('any-avail-btn');
  if (btn.classList.contains('sel')) {
    btn.classList.remove('sel');
    state.selected = [];
    state.anyAvailable = false;
    // Re-enable therapist cards
    document.querySelectorAll('.t-card').forEach(c => c.style.opacity = '');
    updateSelBar();
    return;
  }
  // Select any available — use all therapists at this location
  btn.classList.add('sel');
  state.anyAvailable = true;
  state.selected = THERAPISTS[state.location].slice(); // all therapists
  // Grey out individual cards to show they're not needed
  document.querySelectorAll('.t-card').forEach(c => { c.style.opacity = '0.4'; c.style.pointerEvents = 'none'; });
  document.getElementById('hint-text').textContent = 'Any available therapist will be matched to your session.';
  document.getElementById('btn1').disabled = false;
  // Update sel bar
  const s1 = document.getElementById('slot1');
  const s2 = document.getElementById('slot2');
  const s3 = document.getElementById('slot3');
  s1.innerHTML = '<div class="sel-lbl">First</div><div class="sel-name">Any available</div>';
  s2.innerHTML = '<div class="sel-lbl">Second</div><div class="sel-empty">Auto-matched</div>';
  s3.innerHTML = '<div class="sel-lbl">Third</div><div class="sel-empty">Auto-matched</div>';
}

function toggleTherapist(id) {
  const t = THERAPISTS[state.location].find(x => x.id === id);
  const idx = state.selected.findIndex(x => x.id === id);
  if (idx !== -1) state.selected.splice(idx, 1);
  else if (state.selected.length < 3) state.selected.push(t);
  else return;
  renderGrid(); updateSelBar();
}

function renderGrid() {
  const maxed = state.selected.length >= 3;
  const selClasses = ['sel1', 'sel2', 'sel3'];
  const badges = ['b1', 'b2', 'b3'];
  const labels = ['1st', '2nd', '3rd'];
  document.getElementById('t-grid').innerHTML = THERAPISTS[state.location].map(t => {
    const idx = state.selected.findIndex(x => x.id === t.id);
    const isSel = idx !== -1;
    const cls = isSel ? selClasses[idx] : (maxed ? 'maxed' : '');
    return `<div class="t-card ${cls}" onclick="toggleTherapist(${t.id})">
      ${isSel ? `<div class="t-badge ${badges[idx]}">${labels[idx]}</div>` : ''}
      <div class="t-av" style="background:${t.bg};color:${t.fg}">${t.initials}</div>
      <div class="t-name">${t.name}</div>
      <div class="t-spec">${t.spec}</div>
    </div>`;
  }).join('');
}

function updateSelBar() {
  ['slot1', 'slot2', 'slot3'].forEach((id, i) => {
    const el = document.getElementById(id);
    const labels = ['First', 'Second', 'Third'];
    el.innerHTML = state.selected[i]
      ? `<div class="sel-lbl">${labels[i]}</div><div class="sel-name">${state.selected[i].name}</div>`
      : `<div class="sel-lbl">${labels[i]}</div><div class="sel-empty">${i === 0 ? 'Not selected' : 'Optional'}</div>`;
  });
  const n = state.selected.length;
  document.getElementById('hint-text').textContent =
    n === 3 ? '3 therapists selected — ready to continue' :
    n === 2 ? '2 selected — add a third or continue' :
    n === 1 ? '1 selected — add more or continue' :
    'Select 1, 2, or 3 therapists.';
  document.getElementById('btn1').disabled = n === 0;
}

// ── Page 2: Duration + Session Limit Check ────────────
function checkOverLimit() {
  const used = client.sessionsUsed || 0;
  const limit = client.sessionsLimit || MEMBERSHIP_LIMITS[client.membership] || 4;
  const now = new Date();
  const monthName = MONTHS[now.getMonth()];
  const notice = document.getElementById('over-limit-notice');
  const noticeText = document.getElementById('over-limit-text');

  if (used >= limit) {
    state.isOverLimit = true;
    noticeText.textContent = `You've used all ${limit} of your ${client.membership} sessions for ${monthName}. You can still book — staff will process additional session billing after your visit.`;
    notice.style.display = 'flex';
  } else {
    state.isOverLimit = false;
    const remaining = limit - used;
    noticeText.textContent = `You have ${remaining} session${remaining !== 1 ? 's' : ''} remaining for ${monthName}.`;
    notice.style.display = 'flex';
    notice.className = 'notice teal';
    noticeText.style.color = '';
  }
}

function selectDuration(btn, mins, numSlots) {
  document.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  state.duration = mins; state.numSlots = numSlots;
  document.getElementById('addon-info').style.display = mins > 50 ? 'flex' : 'none';
  document.getElementById('btn2').disabled = false;
}

function toggleAddon(btn, key) {
  btn.classList.toggle('sel');
  const idx = state.addons.indexOf(key);
  if (idx === -1) state.addons.push(key); else state.addons.splice(idx, 1);
}

// ── Page 3: Calendar ──────────────────────────────────
function initCalendar() {
  state.date = null; state.timeSlot = null;
  document.getElementById('time-section').style.display = 'none';
  document.getElementById('btn3').disabled = true;
  renderCalendar(); loadAvailableDates();
}

function isSunday(y, m, d) { return new Date(y, m, d).getDay() === 0; }

function renderCalendar() {
  document.getElementById('cal-month').textContent = `${MONTHS[state.calMonth]} ${state.calYear}`;
  const first = new Date(state.calYear, state.calMonth, 1).getDay();
  const days = new Date(state.calYear, state.calMonth + 1, 0).getDate();
  const today = new Date();
  let html = DAYS.map(d => `<div class="date-hdr">${d}</div>`).join('');
  for (let i = 0; i < first; i++) html += `<div class="date-btn empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const dt = `${state.calYear}-${String(state.calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = new Date(state.calYear, state.calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = d === today.getDate() && state.calMonth === today.getMonth() && state.calYear === today.getFullYear();
    const isSun = isSunday(state.calYear, state.calMonth, d);
    const isAvail = state.availableDates.includes(dt);
    const isSel = state.date === dt;
    let cls = '';
    if (isSun) cls = 'closed';
    else if (isPast) cls = 'unavail';
    else if (!isAvail && state.availableDates.length > 0) cls = 'unavail';
    else if (isSel) cls = 'sel';
    else if (isToday) cls = 'today';
    html += `<div class="date-btn ${cls}" ${!isSun && !isPast ? `onclick="selectDate('${dt}')"` : ''}><div class="date-num">${d}</div>${isSun ? '<div class="date-closed-lbl">Closed</div>' : ''}</div>`;
  }
  document.getElementById('date-grid').innerHTML = html;
}

async function loadAvailableDates() {
  const typeId = MEMBERSHIP_TYPES[client.membership] || 43687655;
  const calId = state.selected[0].id;
  const month = `${state.calYear}-${String(state.calMonth + 1).padStart(2, '0')}`;
  try {
    const dates = await api('availability/dates', { appointmentTypeID: typeId, calendarID: calId, month, timezone: 'America/New_York' });
    state.availableDates = Array.isArray(dates) ? dates.map(d => d.date).filter(dt => new Date(dt + 'T12:00:00').getDay() !== 0) : [];
    renderCalendar();
  } catch(e) { console.error(e); }
}

function prevMonth() {
  if (state.calMonth === 0) { state.calMonth = 11; state.calYear--; } else state.calMonth--;
  state.availableDates = []; renderCalendar(); loadAvailableDates();
}

function nextMonth() {
  if (state.calMonth === 11) { state.calMonth = 0; state.calYear++; } else state.calMonth++;
  state.availableDates = []; renderCalendar(); loadAvailableDates();
}

async function selectDate(dt) {
  state.date = dt; state.timeSlot = null;
  // Track which month this booking is for
  state.bookingMonth = dt.substring(0, 7);
  document.getElementById('btn3').disabled = true;
  renderCalendar();
  document.getElementById('time-section').style.display = 'block';
  document.getElementById('time-container').innerHTML = `<div class="loading"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>`;
  try { await loadTimes(dt); }
  catch(e) { document.getElementById('time-container').innerHTML = `<div class="no-times">Unable to load times. Please try another date.</div>`; }
}

// ── Slot Chaining Algorithm ───────────────────────────
async function loadTimes(dt) {
  const typeId = MEMBERSHIP_TYPES[client.membership] || 43687655;
  const tz = 'America/New_York';
  const numSlots = state.numSlots;

  const allAvail = await Promise.all(
    state.selected.map(t =>
      api('availability/times', { appointmentTypeID: typeId, calendarID: t.id, date: dt, timezone: tz })
        .then(times => (Array.isArray(times) ? times : []).map(s => ({ time: s.time, therapist: t })))
    )
  );

  const timeMap = {};
  allAvail.forEach(therapistSlots => {
    therapistSlots.forEach(({ time, therapist }) => {
      const ts = new Date(time).getTime();
      if (!timeMap[ts]) timeMap[ts] = [];
      timeMap[ts].push({ time, therapist });
    });
  });

  const SLOT_MS = 30 * 60 * 1000;
  const chains = [];
  const startTimes = Object.keys(timeMap).map(Number).sort((a, b) => a - b);
  startTimes.forEach(startTs => buildChains(startTs, numSlots, [], chains, timeMap, SLOT_MS));

  chains.sort((a, b) => new Date(a[0].time).getTime() - new Date(b[0].time).getTime());

  const byStartTime = {};
  chains.forEach(chain => {
    const key = chain[0].time;
    if (!byStartTime[key]) byStartTime[key] = [];
    byStartTime[key].push(chain);
  });

  state.timeSlots = Object.values(byStartTime).map(variants => {
    variants.sort((a, b) => new Set(b.map(s => s.therapist.id)).size - new Set(a.map(s => s.therapist.id)).size);
    return variants[0];
  });

  renderTimes();
}

function buildChains(ts, remaining, current, results, timeMap, SLOT_MS) {
  if (remaining === 0) { results.push([...current]); return; }
  const available = timeMap[ts];
  if (!available || !available.length) return;
  const tried = new Set();
  available.forEach(({ time, therapist }) => {
    if (tried.has(therapist.id)) return;
    tried.add(therapist.id);
    current.push({ time, therapist });
    buildChains(ts + SLOT_MS, remaining - 1, current, results, timeMap, SLOT_MS);
    current.pop();
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  let h = d.getHours(), m = d.getMinutes();
  const ap = h >= 12 ? 'pm' : 'am';
  if (h > 12) h -= 12; if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

function renderTimes() {
  const container = document.getElementById('time-container');
  if (!state.timeSlots.length) {
    container.innerHTML = `<div class="no-times">No available ${state.duration}-min sessions on this date. Try another day or reduce the session length.</div>`;
    return;
  }
  document.getElementById('time-label').textContent = `Available ${state.duration}-min sessions`;
  container.innerHTML = `<div class="time-grid">${state.timeSlots.map((chain, i) => {
    const detail = chain.map(s => `${formatTime(s.time)} ${s.therapist.name.split(' ')[0]}`).join(' → ');
    return `<div class="time-btn" onclick="selectTime(${i})">
      <div>${formatTime(chain[0].time)}</div>
      <div class="time-sub">${detail}</div>
    </div>`;
  }).join('')}</div>`;
}

function selectTime(idx) {
  state.timeSlot = idx;
  document.querySelectorAll('.time-btn').forEach((b, i) => b.classList.toggle('sel', i === idx));
  document.getElementById('btn3').disabled = false;
}

// ── Page 4: Summary ───────────────────────────────────
function buildSummary() {
  const chain = state.timeSlots[state.timeSlot];
  const loc = state.location === 'braintree' ? '89 Hancock St, Braintree' : '174 Middle St, Weymouth';
  const used = client.sessionsUsed || 0;
  const limit = client.sessionsLimit || MEMBERSHIP_LIMITS[client.membership] || 4;
  const isOver = used >= limit;

  // Show over-limit billing notice
  const billingNotice = document.getElementById('billing-notice');
  const billingText = document.getElementById('billing-notice-text');
  const overConsent = document.getElementById('over-consent-box');

  if (isOver) {
    billingText.textContent = `You've reached your ${client.membership} monthly limit (${used}/${limit} sessions used). Staff will process additional session billing after your visit.`;
    billingNotice.style.display = 'flex';
    overConsent.style.display = 'block';
  } else {
    billingNotice.style.display = 'none';
    overConsent.style.display = 'none';
  }

  let rows = `<div class="sum-row"><span class="sum-lbl">Member</span><span class="sum-val">${client.first} ${client.last}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Membership</span><span class="sum-val">${client.membership}/month · ${used}/${limit} used</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Location</span><span class="sum-val">${loc}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Date</span><span class="sum-val">${formatDate(state.date)}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Duration</span><span class="sum-val">${state.duration} min${state.duration > 50 ? ' (+' + (state.duration - 50) + ' min add-on)' : ''}</span></div>`;
  chain.forEach((slot, i) => {
    rows += `<div class="sum-row"><span class="sum-lbl">Slot ${i + 1}</span><span class="sum-val">${formatTime(slot.time)} — ${slot.therapist.name}</span></div>`;
  });
  if (isOver) rows += `<div class="sum-row"><span class="sum-lbl">Billing</span><span class="sum-val" style="color:var(--amber)">Additional session — billed after visit</span></div>`;
  
  document.getElementById('summary').innerHTML = rows;
}

function formatDate(dt) {
  return new Date(dt + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

async function submitBooking() {
  const c1 = document.getElementById('consent1').checked;
  const c2 = document.getElementById('consent2').checked;
  const used = client.sessionsUsed || 0;
  const limit = client.sessionsLimit || MEMBERSHIP_LIMITS[client.membership] || 4;
  const isOver = used >= limit;
  const c3 = isOver ? document.getElementById('consent3').checked : true;
  const errMsg = document.getElementById('error-msg');

  if (!c1 || !c2 || !c3) { errMsg.classList.add('show'); return; }
  errMsg.classList.remove('show');

  const btn = document.getElementById('btn4');
  btn.disabled = true; btn.textContent = 'Booking...';
  const chain = state.timeSlots[state.timeSlot];
  const typeId = MEMBERSHIP_TYPES[client.membership] || 43687655;

  try {
    await Promise.all(chain.map(slot => bookAppt(typeId, slot.therapist.id, slot.time)));
    // Record session usage for the booking month
    // Record one session per slot booked
    for (let i = 0; i < chain.length; i++) {
      await fetch(`${PROXY}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'record', code: client.code, month: state.bookingMonth })
      });
    }
    const overNote = isOver ? ' This is an additional session beyond your monthly limit — staff will process billing after your visit.' : '';
    const addonNote = '';
    document.getElementById('success-msg').textContent = `Confirmed, ${client.first}! A confirmation email is heading to ${client.email}.${overNote}${addonNote} See you soon!`;
    goTo(5);
  } catch(e) {
    btn.disabled = false; btn.textContent = 'Confirm booking';
    errMsg.textContent = 'Something went wrong. Please try again.';
    errMsg.classList.add('show');
  }
}

function resetAndBookAgain() {
  // Reset state fully
  state = {
    location: null, selected: [], anyAvailable: false, duration: null, numSlots: null,
    addons: [], date: null, timeSlot: null,
    calYear: new Date().getFullYear(), calMonth: new Date().getMonth(),
    availableDates: [], timeSlots: [],
    isOverLimit: false, bookingMonth: null
  };
  // Refresh client session data
  fetch(`${PROXY}/api/clients?code=${client.code}`)
    .then(r => r.json())
    .then(c => {
      client = c;
      const used = c.sessionsUsed || 0;
      const limit = c.sessionsLimit || MEMBERSHIP_LIMITS[c.membership] || 4;
      const remaining = Math.max(0, limit - used);
      const pill = document.getElementById('session-pill');
      const now = new Date();
      const monthName = MONTHS_SHORT[now.getMonth()];
      if (used >= limit) {
        pill.textContent = `${monthName}: ${used}/${limit} — over limit`;
        pill.classList.add('over');
      } else {
        pill.classList.remove('over');
        pill.textContent = `${monthName}: ${remaining} session${remaining !== 1 ? 's' : ''} left`;
      }
    });
  // Reset UI
  document.querySelectorAll('.loc-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById('therapist-section').style.display = 'none';
  document.getElementById('consent1').checked = false;
  document.getElementById('consent2').checked = false;
  const c3 = document.getElementById('consent3');
  if (c3) c3.checked = false;
  goTo(1);
}

function bookAppt(typeId, calId, datetime) {
  return fetch(`${PROXY}/api/acuity?endpoint=appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: client.first, lastName: client.last,
      email: client.email, phone: client.phone,
      appointmentTypeID: typeId, calendarID: calId,
      datetime: datetime,
      notes: '* Booked online via member portal',
      fields: [{ id: 13049797, value: 'yes' }]
    })
  }).then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); });
}

// ── NON-MEMBER FLOW ───────────────────────────────────
const NM_TYPE_ID = 87550896; // Non-Member Stretch & Bodywork
let nmState = {
  location: null, selected: null, anyAvailable: false,
  date: null, timeSlot: null, timeSlots: [],
  calYear: new Date().getFullYear(), calMonth: new Date().getMonth(),
  availableDates: []
};

function switchToNonMember() {
  document.getElementById('gate').style.display = 'none';
  document.getElementById('nonmember').style.display = 'block';
  // If this was triggered by a guest code, go straight to therapist selection
  if (window.guestClient) {
    nmGoTo(2);
  }
}

function nmGoTo(n) {
  // If guest, skip page 1 (details already pre-filled)
  if (n === 2 && window.guestClient) {
    const wn = document.getElementById('nm-welcome-name');
    if (wn) wn.textContent = `Welcome, ${window.guestClient.first}!`;
  }
  document.querySelectorAll('#nonmember .page').forEach(p => p.classList.remove('active'));
  document.getElementById('nm-page' + n).classList.add('active');
  ['nm-s1','nm-s2','nm-s3','nm-s4'].forEach((id, i) => {
    const s = document.getElementById(id);
    s.classList.remove('active','done');
    if (i+1 < n) s.classList.add('done');
    else if (i+1 === n) s.classList.add('active');
  });
  if (n === 2) nmInitTherapists();
  if (n === 3) nmInitCalendar();
  if (n === 4) nmBuildSummary();

  // Validate page 1 only if not a guest
  if (n === 2 && !window.guestClient) {
    const first = document.getElementById('nm-first').value.trim();
    const last = document.getElementById('nm-last').value.trim();
    const email = document.getElementById('nm-email').value.trim();
    const phone = document.getElementById('nm-phone').value.trim();
    if (!first || !last || !email || !phone) {
      document.getElementById('nm-error1').classList.add('show');
      document.querySelectorAll('#nonmember .page').forEach(p => p.classList.remove('active'));
      document.getElementById('nm-page1').classList.add('active');
      return;
    }
    document.getElementById('nm-error1').classList.remove('show');
  }
}

function nmInitTherapists() {
  if (!nmState.location) return;
  nmRenderGrid();
}

function nmSelectLocation(btn, loc) {
  document.querySelectorAll('#nm-loc-braintree, #nm-loc-weymouth').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  nmState.location = loc; nmState.selected = null; nmState.anyAvailable = false;
  document.getElementById('nm-therapist-section').style.display = 'block';
  document.getElementById('nm-any-avail-btn').classList.remove('sel');
  nmRenderGrid();
  document.getElementById('nm-btn2').disabled = true;
}

function nmSelectAnyAvailable() {
  const btn = document.getElementById('nm-any-avail-btn');
  if (btn.classList.contains('sel')) {
    btn.classList.remove('sel');
    nmState.anyAvailable = false; nmState.selected = null;
    document.querySelectorAll('#nm-t-grid .t-card').forEach(c => { c.style.opacity=''; c.style.pointerEvents=''; });
    document.getElementById('nm-btn2').disabled = true;
    return;
  }
  btn.classList.add('sel');
  nmState.anyAvailable = true;
  nmState.selected = THERAPISTS[nmState.location];
  document.querySelectorAll('#nm-t-grid .t-card').forEach(c => { c.style.opacity='0.4'; c.style.pointerEvents='none'; });
  document.getElementById('nm-hint-text').textContent = 'Any available therapist will be matched to your session.';
  document.getElementById('nm-btn2').disabled = false;
}

function nmSelectTherapist(id) {
  const btn = document.getElementById('nm-any-avail-btn');
  btn.classList.remove('sel');
  nmState.anyAvailable = false;
  const t = THERAPISTS[nmState.location].find(x => x.id === id);
  nmState.selected = [t];
  nmRenderGrid();
  document.getElementById('nm-btn2').disabled = false;
}

function nmRenderGrid() {
  document.getElementById('nm-t-grid').innerHTML = THERAPISTS[nmState.location].map(t => {
    const isSel = nmState.selected && !nmState.anyAvailable && nmState.selected[0]?.id === t.id;
    return `<div class="t-card ${isSel ? 'sel1' : ''}" onclick="nmSelectTherapist(${t.id})">
      <div class="t-av" style="background:${t.bg};color:${t.fg}">${t.initials}</div>
      <div class="t-name">${t.name}</div>
      <div class="t-spec">${t.spec}</div>
    </div>`;
  }).join('');
}

function nmInitCalendar() {
  nmState.date = null; nmState.timeSlot = null;
  document.getElementById('nm-time-section').style.display = 'none';
  document.getElementById('nm-btn3').disabled = true;
  nmRenderCalendar(); nmLoadAvailableDates();
}

function nmRenderCalendar() {
  document.getElementById('nm-cal-month').textContent = `${MONTHS[nmState.calMonth]} ${nmState.calYear}`;
  const first = new Date(nmState.calYear, nmState.calMonth, 1).getDay();
  const days = new Date(nmState.calYear, nmState.calMonth + 1, 0).getDate();
  const today = new Date();
  let html = DAYS.map(d => `<div class="date-hdr">${d}</div>`).join('');
  for (let i = 0; i < first; i++) html += `<div class="date-btn empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const dt = `${nmState.calYear}-${String(nmState.calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isPast = new Date(nmState.calYear, nmState.calMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = d === today.getDate() && nmState.calMonth === today.getMonth() && nmState.calYear === today.getFullYear();
    const isSun = new Date(nmState.calYear, nmState.calMonth, d).getDay() === 0;
    const isAvail = nmState.availableDates.includes(dt);
    const isSel = nmState.date === dt;
    let cls = '';
    if (isSun) cls = 'closed';
    else if (isPast) cls = 'unavail';
    else if (!isAvail && nmState.availableDates.length > 0) cls = 'unavail';
    else if (isSel) cls = 'sel';
    else if (isToday) cls = 'today';
    html += `<div class="date-btn ${cls}" ${!isSun && !isPast ? `onclick="nmSelectDate('${dt}')"` : ''}><div class="date-num">${d}</div>${isSun ? '<div class="date-closed-lbl">Closed</div>' : ''}</div>`;
  }
  document.getElementById('nm-date-grid').innerHTML = html;
}

async function nmLoadAvailableDates() {
  const calId = nmState.selected[0].id;
  const month = `${nmState.calYear}-${String(nmState.calMonth+1).padStart(2,'0')}`;
  try {
    const dates = await api('availability/dates', { appointmentTypeID: NM_TYPE_ID, calendarID: calId, month, timezone: 'America/New_York' });
    nmState.availableDates = Array.isArray(dates) ? dates.map(d => d.date).filter(dt => new Date(dt+'T12:00:00').getDay() !== 0) : [];
    nmRenderCalendar();
  } catch(e) { console.error(e); }
}

function nmPrevMonth() {
  if (nmState.calMonth === 0) { nmState.calMonth = 11; nmState.calYear--; } else nmState.calMonth--;
  nmState.availableDates = []; nmRenderCalendar(); nmLoadAvailableDates();
}

function nmNextMonth() {
  if (nmState.calMonth === 11) { nmState.calMonth = 0; nmState.calYear++; } else nmState.calMonth++;
  nmState.availableDates = []; nmRenderCalendar(); nmLoadAvailableDates();
}

async function nmSelectDate(dt) {
  nmState.date = dt; nmState.timeSlot = null;
  document.getElementById('nm-btn3').disabled = true;
  nmRenderCalendar();
  document.getElementById('nm-time-section').style.display = 'block';
  document.getElementById('nm-time-container').innerHTML = `<div class="loading"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>`;
  try {
    const therapists = nmState.anyAvailable ? THERAPISTS[nmState.location] : nmState.selected;
    const allTimes = await Promise.all(
      therapists.map(t => api('availability/times', { appointmentTypeID: NM_TYPE_ID, calendarID: t.id, date: dt, timezone: 'America/New_York' })
        .then(times => (Array.isArray(times) ? times : []).map(s => ({ time: s.time, therapist: t })))
      )
    );
    // For non-members, just show individual 50-min slots (single slot per therapist)
    const allSlots = allTimes.flat();
    // Deduplicate by time, keep first therapist available
    const seen = new Set();
    nmState.timeSlots = allSlots.filter(s => {
      if (seen.has(s.time)) return false;
      seen.add(s.time);
      return true;
    }).sort((a, b) => new Date(a.time) - new Date(b.time));
    nmRenderTimes();
  } catch(e) {
    document.getElementById('nm-time-container').innerHTML = `<div class="no-times">Unable to load times. Please try another date.</div>`;
  }
}

function nmRenderTimes() {
  const c = document.getElementById('nm-time-container');
  if (!nmState.timeSlots.length) {
    c.innerHTML = `<div class="no-times">No available times on this date. Please select another day.</div>`;
    return;
  }
  c.innerHTML = `<div class="time-grid">${nmState.timeSlots.map((s, i) =>
    `<div class="time-btn" onclick="nmSelectTime(${i})">
      <div>${formatTime(s.time)}</div>
      <div class="time-sub">${s.therapist.name.split(' ')[0]} · 50 min</div>
    </div>`
  ).join('')}</div>`;
}

function nmSelectTime(idx) {
  nmState.timeSlot = idx;
  document.querySelectorAll('#nm-time-container .time-btn').forEach((b, i) => b.classList.toggle('sel', i === idx));
  document.getElementById('nm-btn3').disabled = false;
}

function nmBuildSummary() {
  const slot = nmState.timeSlots[nmState.timeSlot];
  const loc = nmState.location === 'braintree' ? '89 Hancock St, Braintree' : '174 Middle St, Weymouth';
  const first = document.getElementById('nm-first').value.trim();
  const last = document.getElementById('nm-last').value.trim();
  let rows = `<div class="sum-row"><span class="sum-lbl">Name</span><span class="sum-val">${first} ${last}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Location</span><span class="sum-val">${loc}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Date</span><span class="sum-val">${formatDate(nmState.date)}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Time</span><span class="sum-val">${formatTime(slot.time)}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Therapist</span><span class="sum-val">${slot.therapist.name}</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Duration</span><span class="sum-val">50 min</span></div>`;
  rows += `<div class="sum-row"><span class="sum-lbl">Rate</span><span class="sum-val">$95 — pay in studio</span></div>`;
  document.getElementById('nm-summary').innerHTML = rows;
}

async function nmSubmit() {
  const c1 = document.getElementById('nm-consent1').checked;
  const c2 = document.getElementById('nm-consent2').checked;
  const errMsg = document.getElementById('nm-error4');
  if (!c1 || !c2) { errMsg.classList.add('show'); return; }
  errMsg.classList.remove('show');
  const btn = document.getElementById('nm-btn4');
  btn.disabled = true; btn.textContent = 'Booking...';
  const slot = nmState.timeSlots[nmState.timeSlot];
  const first = document.getElementById('nm-first').value.trim();
  const last = document.getElementById('nm-last').value.trim();
  const email = document.getElementById('nm-email').value.trim();
  const phone = document.getElementById('nm-phone').value.trim();
  try {
    await fetch(`${PROXY}/api/acuity?endpoint=appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: first, lastName: last, email, phone,
        appointmentTypeID: NM_TYPE_ID,
        calendarID: slot.therapist.id,
        datetime: slot.time,
        notes: '* Booked online — non-member',
        fields: [{ id: 13049797, value: 'yes' }]
      })
    }).then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); });
    document.getElementById('nm-success-msg').textContent = `Confirmed, ${first}! A confirmation email is heading to ${email}. Please bring $95 to pay in studio. See you soon!`;
    nmGoTo(5);
  } catch(e) {
    btn.disabled = false; btn.textContent = 'Confirm booking';
    errMsg.textContent = 'Something went wrong. Please try again.';
    errMsg.classList.add('show');
  }
}

</script>
