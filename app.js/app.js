const express = require('express');
const jstat = require('jstat'); // Necesario para realizar los cálculos
const app = express();
const port = 3000;

app.use(express.json());

// Ruta para distribución normal
app.post('/calculateProbability', (req, res) => {
    try {
        const { mu, sigma, x, tipo_probabilidad } = req.body;

        if (!['mayor', 'menor'].includes(tipo_probabilidad)) {
            return res.status(400).json({ error: 'Tipo de probabilidad no válido' });
        }

        if (sigma <= 0) {
            return res.status(400).json({ error: 'La desviación estándar debe ser mayor que cero' });
        }

        let probabilidad;
        if (tipo_probabilidad === 'mayor') {
            probabilidad = 1 - jstat.normal.cdf(x, mu, sigma);
        } else { // tipo_probabilidad === 'menor'
            probabilidad = jstat.normal.cdf(x, mu, sigma);
        }

        res.json({ probabilidad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para distribución binomial
app.post('/calculateBinomialProbability', (req, res) => {
    try {
        const { n, p, x, tipo_probabilidad } = req.body;

        let probabilidad;
        if (tipo_probabilidad === 'exact') {
            probabilidad = jstat.binomial.pdf(x, n, p); // PMF para probabilidad exacta
        } else if (tipo_probabilidad === 'greater') {
            probabilidad = jstat.binomial.sf(x - 1, n, p); // Complemento acumulativo
        } else if (tipo_probabilidad === 'less') {
            probabilidad = jstat.binomial.cdf(x, n, p); // CDF para acumulativa
        } else {
            return res.status(400).json({ error: 'Tipo de probabilidad no válido' });
        }

        res.json({ probabilidad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para distribución Poisson
app.post('/calculatePoissonProbability', (req, res) => {
    try {
        const { lambda, x, tipo_probabilidad } = req.body;

        let probabilidad;
        if (tipo_probabilidad === 'exact') {
            probabilidad = jstat.poisson.pdf(x, lambda); // PMF para probabilidad exacta
        } else if (tipo_probabilidad === 'greater') {
            probabilidad = jstat.poisson.sf(x - 1, lambda); // Complemento acumulativo
        } else if (tipo_probabilidad === 'less') {
            probabilidad = jstat.poisson.cdf(x, lambda); // CDF para acumulativa
        } else {
            return res.status(400).json({ error: 'Tipo de probabilidad no válido' });
        }

        res.json({ probabilidad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Servir archivos HTML desde la carpeta "public"
app.use(express.static('public'));

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
