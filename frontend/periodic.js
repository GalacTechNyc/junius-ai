

// frontend/periodic.js
(function () {
  const ELEMENTS = [
    { symbol: 'H',  name: 'Hydrogen',   atomic: 1,  mass: '1.008' },
    { symbol: 'He', name: 'Helium',     atomic: 2,  mass: '4.0026' },
    { symbol: 'Li', name: 'Lithium',    atomic: 3,  mass: '6.94' },
    { symbol: 'C',  name: 'Carbon',     atomic: 6,  mass: '12.011' },
    { symbol: 'N',  name: 'Nitrogen',   atomic: 7,  mass: '14.007' },
    { symbol: 'O',  name: 'Oxygen',     atomic: 8,  mass: '15.999' },
    { symbol: 'Ne', name: 'Neon',       atomic: 10, mass: '20.180' },
    { symbol: 'Na', name: 'Sodium',     atomic: 11, mass: '22.990' },
    { symbol: 'Mg', name: 'Magnesium',  atomic: 12, mass: '24.305' },
    { symbol: 'Si', name: 'Silicon',    atomic: 14, mass: '28.085' },
    { symbol: 'S',  name: 'Sulfur',     atomic: 16, mass: '32.06' },
    { symbol: 'Cl', name: 'Chlorine',   atomic: 17, mass: '35.45' },
    { symbol: 'K',  name: 'Potassium',  atomic: 19, mass: '39.098' },
    { symbol: 'Fe', name: 'Iron',       atomic: 26, mass: '55.845' },
    { symbol: 'Cu', name: 'Copper',     atomic: 29, mass: '63.546' },
    { symbol: 'Ag', name: 'Silver',     atomic: 47, mass: '107.87' },
    { symbol: 'Au', name: 'Gold',       atomic: 79, mass: '196.97' },
    { symbol: 'Pb', name: 'Lead',       atomic: 82, mass: '207.2' }
  ];

  const box   = document.getElementById('periodic-box');
  const symEl = box.querySelector('.element-symbol');
  const nameEl= box.querySelector('.element-name');
  const infoEl= box.querySelector('.element-info');

  function renderRandom() {
    const el = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    symEl.textContent  = el.symbol;
    nameEl.textContent = el.name;
    infoEl.innerHTML   = `Atomic&nbsp;#:&nbsp;${el.atomic}<br>Atomic&nbsp;Mass: ${el.mass}`;
  }

  // first render
  renderRandom();
  // shuffle every hour
  setInterval(renderRandom, 60 * 60 * 1000);
})();