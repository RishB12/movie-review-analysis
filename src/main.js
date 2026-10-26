import './style.css'

document.querySelector('#app').innerHTML = `
<div class="app-shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Frame of Mind home">
      <span class="brand-mark" aria-hidden="true">F</span>
      <span class="brand-name">frame<span>of</span>mind</span>
    </a>
    <div class="service-state" id="api-status" data-status="checking" role="status">
      <span class="service-dot" aria-hidden="true"></span>
      <span class="service-label">Connecting to model</span>
    </div>
  </header>

  <main>
    <section class="intro">
      <div class="eyebrow"><span class="eyebrow-mark" aria-hidden="true"></span> MOVIE REVIEW ANALYSIS</div>
      <h1>Stories are subjective.<br><span>Reviews leave a signal.</span></h1>
      <p class="intro-copy">A closer look at the feeling behind a film review.</p>
      <div class="model-tags" aria-label="Model details">
        <span>IMDB review model</span>
        <span class="tag-divider" aria-hidden="true"></span>
        <span>Positive / negative</span>
      </div>
    </section>

    <section class="workspace" aria-label="Review sentiment analyzer">
      <form class="review-panel" id="review-form">
        <div class="panel-heading">
          <div>
            <div class="panel-kicker">01 <span>/</span> THE REVIEW</div>
            <h2>What did you think?</h2>
          </div>
          <span class="text-label">YOUR TEXT</span>
        </div>

        <label class="visually-hidden" for="review-input">Movie review</label>
        <textarea id="review-input" name="review" maxlength="10000" placeholder="Paste a movie review here..." required></textarea>

        <div class="editor-meta">
          <span>Longer reviews give the model more to read.</span>
          <span id="character-count">0 / 10,000</span>
        </div>

        <div class="samples" aria-label="Example reviews">
          <span class="samples-label">TRY A SAMPLE</span>
          <button class="sample-button" type="button" data-sample="A beautifully made film with a moving story and performances that stayed with me long after the credits.">Thoughtful</button>
          <button class="sample-button" type="button" data-sample="A dull, overlong mess with wooden acting and a plot that goes nowhere. I couldn't wait for it to end.">Not for me</button>
        </div>

        <div class="form-actions">
          <button class="analyze-button" id="analyze-button" type="submit" disabled>
            <span>Analyze sentiment</span>
            <span class="button-arrow" aria-hidden="true">&#8594;</span>
          </button>
          <button class="clear-button" id="clear-button" type="button" aria-label="Clear review" title="Clear review">Clear</button>
        </div>
        <p class="form-error" id="form-error" role="alert" hidden></p>
      </form>

      <aside class="result-panel" aria-labelledby="result-title">
        <div class="result-topline">
          <div class="panel-kicker">02 <span>/</span> THE READOUT</div>
          <span class="readout-indicator"><span aria-hidden="true"></span> MODEL OUTPUT</span>
        </div>
        <div class="result-content" id="result-content" aria-live="polite" aria-atomic="true">
          <div class="empty-result">
            <div class="empty-mark" aria-hidden="true"><span></span><span></span><span></span></div>
            <h2 id="result-title">A feeling, quantified.</h2>
            <p>Your readout will appear here.</p>
          </div>
        </div>
        <div class="result-footer">
          <span>TEXT CLASSIFIER</span>
          <span>TF-IDF <i aria-hidden="true">+</i> LOGISTIC REGRESSION</span>
        </div>
      </aside>
    </section>
  </main>

  <footer class="page-footer">
    <span>FRAME OF MIND <span class="footer-separator">/</span> SENTIMENT STUDY</span>
    <span>MADE FOR MOVIE PEOPLE</span>
  </footer>
</div>
`

const form = document.querySelector('#review-form')
const input = document.querySelector('#review-input')
const analyzeButton = document.querySelector('#analyze-button')
const clearButton = document.querySelector('#clear-button')
const characterCount = document.querySelector('#character-count')
const formError = document.querySelector('#form-error')
const resultContent = document.querySelector('#result-content')
const apiStatus = document.querySelector('#api-status')

function setServiceStatus(status, label) {
  apiStatus.dataset.status = status
  apiStatus.querySelector('.service-label').textContent = label
}

function updateInputState() {
  const length = input.value.length
  characterCount.textContent = `${length.toLocaleString()} / 10,000`
  analyzeButton.disabled = !input.value.trim() || analyzeButton.dataset.loading === 'true'
}

function showError(message) {
  formError.textContent = message
  formError.hidden = false
}

async function checkService() {
  try {
    const response = await fetch('http://localhost:8001/health')
    if (!response.ok) throw new Error('Unavailable')
    setServiceStatus('online', 'Model online')
  } catch {
    setServiceStatus('offline', 'Model offline')
  }
}

input.addEventListener('input', () => {
  formError.hidden = true
  updateInputState()
})

document.querySelectorAll('[data-sample]').forEach((button) => {
  button.addEventListener('click', () => {
    input.value = button.dataset.sample
    formError.hidden = true
    updateInputState()
    input.focus()
  })
})

clearButton.addEventListener('click', () => {
  input.value = ''
  formError.hidden = true
  updateInputState()
  input.focus()
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const review = input.value.trim()
  if (!review) return

  formError.hidden = true
  analyzeButton.dataset.loading = 'true'
  analyzeButton.disabled = true
  analyzeButton.querySelector('span').textContent = 'Reading your review...'
  resultContent.innerHTML = '<div class="loading-result"><span class="loading-line"></span><p>Finding the feeling in the frame.</p></div>'

  try {
    const response = await fetch('http://localhost:8001/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'The review could not be analyzed.')

    const sentiment = String(data.sentiment).toLowerCase()
    if (!['positive', 'negative'].includes(sentiment)) {
      throw new Error('The model returned an unexpected result.')
    }

    const confidence = Math.max(0, Math.min(100, Number(data.confidence)))
    if (!Number.isFinite(confidence)) throw new Error('The model returned an invalid confidence score.')

    resultContent.innerHTML = `
      <div class="readout-result sentiment-${sentiment}">
        <div class="sentiment-stamp" aria-hidden="true">${sentiment === 'positive' ? '+' : '&minus;'}</div>
        <div class="result-overline">THE MODEL LEANS</div>
        <h2 id="result-title">${sentiment}</h2>
        <div class="confidence-heading"><span>Model confidence</span><strong>${confidence.toFixed(1)}%</strong></div>
        <div class="confidence-track" role="img" aria-label="Model confidence ${confidence.toFixed(1)} percent">
          <span style="width: ${confidence}%"></span>
        </div>
        <div class="confidence-scale"><span>UNCERTAIN</span><span>CONFIDENT</span></div>
      </div>
    `
    setServiceStatus('online', 'Model online')
  } catch (error) {
    resultContent.innerHTML = '<div class="empty-result"><div class="empty-mark empty-mark-error" aria-hidden="true"><span></span><span></span><span></span></div><h2 id="result-title">No readout yet.</h2><p>Check the model connection and try again.</p></div>'
    showError(error.message || 'Could not reach the sentiment model. Start the API and try again.')
    setServiceStatus('offline', 'Model offline')
  } finally {
    analyzeButton.dataset.loading = 'false'
    analyzeButton.querySelector('span').textContent = 'Analyze sentiment'
    updateInputState()
  }
})

updateInputState()
checkService()
