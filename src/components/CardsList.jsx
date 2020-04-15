import React, {
	useCallback,
	useEffect,
	useState,
	useLayoutEffect,
	useRef,
} from 'react';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import { Card } from './Card';
import './CardsList.scss';

const CARDS_PER_REQUEST = 20; // How many cards to fetch per request
const SCROLL_THROTTLE_TIME_MS = 50; // Delay after last scroll has occured
const SEARCH_TYPING_THROTTLE_TIME_MS = 500; // Delay before fetching results. Bigger value for less responsive but more bandwidth consuming behavior
const SCROLL_BOTTOM_THRESHOLD = 300; // Distance from the bottom of the page when next portion of cards should be fetched. Bigger value for more user-friendly and traffic-consuming results

export function CardsList() {
	const [isLoading, setIsLoading] = useState(false);
	const [cards, setCards] = useState(new Map());
	const [pageNumber, setPageNumber] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [isEverythingFetched, setIsEverythingFetched] = useState(false);

	const dataCache = useRef(null);
	// fetch data on start
	// eslint-disbale-next-line
	useEffect(() => fetchCards({}), []);

	const fetchCards = useCallback(
		(args) => {
			if (isEverythingFetched) {
				return;
			}

			setIsLoading(true);
			let url = `https://api.elderscrollslegends.io/v1/cards?pageSize=${CARDS_PER_REQUEST}&page=${pageNumber}${
				searchTerm ? '&name=' + searchTerm : ''
			}`;

			fetch(url)
				.then((resp) => {
					return resp.json();
				})
				.then((data) => {
					if (args.cancelled) {
						// something has changed - fetched data should be discarded to avoid race condition
						return;
					}

					data.cards.forEach((card) => {
						// store lowercased name into separate field.
						// This will speed up future search and it can be expanded later if needed
						// to include more data to search in
						card._searchStr = card.name.toLowerCase();
						cards.set(card.id, card);
					});
					setCards(cards);

					setIsLoading(false);

					if (data._totalCount < CARDS_PER_REQUEST * pageNumber) {
						setIsEverythingFetched(true);
					}
				});
		},
		[cards, isEverythingFetched, searchTerm, pageNumber]
	);

	useEffect(() => {
		if (searchTerm === '') {
			return;
		}
		const args = { cancelled: false };
		const timeoutId = setTimeout(() => {
			fetchCards(args);
		}, SEARCH_TYPING_THROTTLE_TIME_MS);

		return () => {
			clearTimeout(timeoutId);
			args.cancelled = true;
		};
	}, [fetchCards, searchTerm]);

	useEffect(() => {
		if (searchTerm !== '' && dataCache.current === null) {
			// start search - cache fetched results and prepopulate search from it
			dataCache.current = {
				pageNumber: pageNumber,
				cards: cards,
				isEverythingFetched: isEverythingFetched,
			};
		}
	}, [searchTerm, cards, pageNumber, isEverythingFetched]);

	useEffect(() => {
		if (searchTerm !== '') {
			const filteredCards = new Map();
			const searchFor = searchTerm.toLowerCase();
			// prepopulate search from known results
			dataCache.current.cards.forEach((card) => {
				if (card._searchStr.indexOf(searchFor) >= 0) {
					filteredCards.set(card.id, card);
				}
			});

			setCards(filteredCards);
			setPageNumber(1);
			setIsEverythingFetched(false);
			setIsLoading(true);
		}

		if (searchTerm === '' && dataCache.current !== null) {
			// search cleared - drop search results and restore cached results if any
			setCards(dataCache.current.cards);
			setPageNumber(dataCache.current.pageNumber);
			setIsEverythingFetched(dataCache.current.isEverythingFetched);
			dataCache.current = null;
		}
	}, [searchTerm]);

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

		if (!lastCardEl) {
			return;
		}

		var elOffset = lastCardEl.offsetTop;
		var pageOffset = window.pageYOffset + window.innerHeight;
		if (elOffset - SCROLL_BOTTOM_THRESHOLD < pageOffset) {
			// load next page
			setPageNumber(pageNumber + 1);
		}
	}

	return (
		<div className="CardsList">
			<InputGroup className="search" size="lg">
				<FormControl
					placeholder="Search for card"
					value={searchTerm}
					onChange={(ev) => setSearchTerm(ev.target.value)}
				/>
				<InputGroup.Append>
					<Button
						variant="outline-secondary"
						disabled={searchTerm === ''}
						onClick={() => {
							setSearchTerm('');
						}}
					>
						Clear
					</Button>
				</InputGroup.Append>
			</InputGroup>
			{isLoading && <Spinner animation="grow" />}
			{isLoading && cards.size === 0 && (
				<Alert variant="info">Please wait while searching</Alert>
			)}
			{!isLoading && searchTerm !== '' && cards.size === 0 && (
				<Alert variant="info">
					Nothing was found - try shortening your search term.
				</Alert>
			)}
			<div className="list">
				{Array.from(cards, ([key, card]) => (
					<Card card={card} key={key} />
				))}
			</div>
		</div>
	);
}
