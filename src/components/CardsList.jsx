import React, { useState } from 'react';
import CardColumns from 'react-bootstrap/CardColumns';

import { Card } from './Card';
import { useEffect } from 'react';

const CARDS_PER_REQUEST = 20;

export function CardsList() {
	const [cards, setCards] = useState([]);
	useEffect(() => fetchCards(setCards, 0, 0), []);

	return (
		<div className="CardsList">
			<CardColumns>
				{cards.map((card) => (
					<Card card={card} key={card.id} />
				))}
			</CardColumns>
		</div>
	);
}

function fetchCards(setCards, offset, page) {
	fetch(
		`https://api.elderscrollslegends.io/v1/cards?pageSize=${CARDS_PER_REQUEST}&page=${page}`
	)
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			console.log(data);
			setCards(data.cards);
		});
}
