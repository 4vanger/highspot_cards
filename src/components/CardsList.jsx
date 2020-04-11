import React, { useEffect, useState, useLayoutEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import { Card } from './Card';
import './CardsList.scss';

const CARDS_PER_REQUEST = 20;
const SCROLL_THROTTLE_TIME_MS = 50;

export function CardsList() {
	const [isLoading, setIsLoading] = useState(false);
	const [cards, setCards] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);

	useEffect(fetchCards, [pageNumber]);

	useLayoutEffect(() => {
		let timeoutId;
		const handleScrollEvent = () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(
				checkScrollPosition,
				SCROLL_THROTTLE_TIME_MS
			);
		};

		window.addEventListener('scroll', handleScrollEvent);
		return () => {
			window.removeEventListener('scroll', handleScrollEvent);
			clearTimeout(timeoutId);
		};
	});

	function checkScrollPosition() {
		const lastCardEl = document.querySelector(
			'.CardsList .Card:last-child'
		);

		var elOffset = lastCardEl.offsetTop;
		var pageOffset = window.pageYOffset + window.innerHeight;
		if (elOffset - 200 < pageOffset) {
			// load next page
			setPageNumber(pageNumber + 1);
		}
	}

	function fetchCards() {
		setIsLoading(true);
		fetch(
			`https://api.elderscrollslegends.io/v1/cards?pageSize=${CARDS_PER_REQUEST}&page=${pageNumber}`
		)
			.then((resp) => {
				return resp.json();
			})
			.then((data) => {
				setCards([...cards, ...data.cards]);
				setIsLoading(false);
			});
	}

	return (
		<div className="CardsList">
			{isLoading && <Spinner animation="grow" />}
			{cards.map((card) => (
				<Card card={card} key={card.id} />
			))}
		</div>
	);
}
