import React from 'react';
import BCard from 'react-bootstrap/Card';

import './Card.scss';

export function Card({ card }) {
	return (
		<BCard className="Card">
			<BCard.Header>
				<BCard.Title>
					{card.name}
					<div className="type">{card.type}</div>
				</BCard.Title>
			</BCard.Header>
			<BCard.Body>
				<BCard.Img variant="top" src={card.imageUrl} className="img" />
				<BCard.Text className="description">{card.text}</BCard.Text>
			</BCard.Body>
		</BCard>
	);
}
