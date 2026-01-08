const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// caminho para o arquivo de produtos (ajusta relativo ao backend/routes)
const PRODUCTS_JSON = path.resolve(__dirname, '..', '..', 'products', 'products-list.json');

// lê e retorna o conteúdo do JSON (não cacheado para refletir alterações durante dev)
function readProductsFile() {
	try {
		const raw = fs.readFileSync(PRODUCTS_JSON, 'utf8');
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed.products) ? parsed.products : [];
	} catch (err) {
		console.error('Erro ao ler products-list.json', err);
		return null;
	}
}

// GET /api/products
// Query params (opcionais):
//  - size=G            -> filtra por availableSizes contendo 'G'
//  - personalization=true|false -> filtra por availablePersonalization
router.get('/', (req, res) => {
	const products = readProductsFile();
	if (products === null) {
		return res.status(500).json({ error: 'Erro ao ler lista de produtos' });
	}

	let result = products.slice();

	// filtro por tamanho
	if (req.query.size) {
		const size = String(req.query.size).toUpperCase();
		result = result.filter(p => Array.isArray(p.availableSizes) && p.availableSizes.includes(size));
	}

	// filtro por personalização (true/false)
	if (typeof req.query.personalization !== 'undefined') {
		const val = String(req.query.personalization).toLowerCase();
		if (val === 'true' || val === 'false') {
			const want = val === 'true';
			result = result.filter(p => Boolean(p.availablePersonalization) === want);
		}
	}

	// retorno simples
	res.json({ products: result });
});

module.exports = router;
