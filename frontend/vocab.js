// frontend/vocab.js
(function () {
  const WORDS = [
    { word: 'Curiosity',   def: 'A strong desire to know or learn something.' },
    { word: 'Ingenious',   def: 'Clever, original, and inventive.' },
    { word: 'Harmony',     def: 'Agreement or concord.' },
    { word: 'Illuminate',  def: 'Light up; make clear.' },
    { word: 'Resilient',   def: 'Able to withstand or recover quickly from difficulties.' },
    { word: 'Courage',     def: 'The ability to do something that frightens one.' },
    { word: 'Venture',     def: 'A risky or daring journey or undertaking.' },
    { word: 'Marvel',      def: 'Be filled with wonder or astonishment.' },
    { word: 'Nurture',     def: 'Care for and encourage the growth of.' },
    { word: 'Persevere',   def: 'Continue despite difficulty.' },
    { word: 'Adventure',  def: 'An unusual and exciting, typically hazardous experience.' },
    { word: 'Inspire',    def: 'Fill someone with the urge or ability to do or feel something.' },
    { word: 'Wonder',     def: 'A feeling of surprise mingled with admiration.' },
    { word: 'Diligent',   def: 'Showing care and conscientiousness in one’s work.' },
    { word: 'Brilliant',  def: 'Exceptionally clever or talented.' },
    { word: 'Optimistic', def: 'Hopeful and confident about the future.' },
    { word: 'Empathy',    def: 'The ability to understand and share the feelings of another.' },
    { word: 'Inventive',  def: 'Having the ability to create or design new things.' },
    { word: 'Gratitude',  def: 'The quality of being thankful.' },
    { word: 'Integrity',  def: 'The quality of being honest and having strong moral principles.' },
    { word: 'Imagination',def: 'The faculty of forming new ideas or images not present to the senses.' },
    { word: 'Resourceful',def: 'Having the ability to find quick and clever ways to overcome difficulties.' },
    { word: 'Serenity',   def: 'The state of being calm, peaceful, and untroubled.' },
    { word: 'Bravery',    def: 'Courageous behavior or character.' },
    { word: 'Collaborate',def: 'Work jointly on an activity, especially to produce or create something.' },
    { word: 'Enthusiasm', def: 'Intense and eager enjoyment, interest, or approval.' },
    { word: 'Insight',    def: 'An accurate and deep understanding of a person or thing.' },
    { word: 'Momentum',   def: 'The impetus gained by a moving object.' },
    { word: 'Patience',   def: 'The capacity to accept delay or trouble without getting angry.' },
    { word: 'Synergy',    def: 'The interaction of elements that produces a combined effect greater than the sum.' }
  ];

  const box  = document.getElementById('vocab-box');
  const wEl  = box.querySelector('.vocab-word');
  const dEl  = box.querySelector('.vocab-def');

  // choose a consistent word per calendar day
  function getWordOfDay() {
    const dayIndex = Math.floor(Date.now() / (24*60*60*1000)) % WORDS.length;
    return WORDS[dayIndex];
  }

  function render() {
    const { word, def } = getWordOfDay();
    wEl.textContent = word;
    dEl.textContent = def;
  }

  render();
})();
