import React from 'react';
import BCard from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import './Card.scss';

export function Card({ card }) {
	return (
		<BCard className="Card">
			<BCard.Header>
				<BCard.Title>
					{card.name}
					<div className="type">{card.type}</div>
				</BCard.Title>
				<BCard.Subtitle>{card.set.name}</BCard.Subtitle>
			</BCard.Header>
			<BCard.Body>
				{(!card.text || card.text === '') && (
					<BCard.Img
						variant="top"
						src={card.imageUrl}
						className="img"
					/>
				)}
				{card.text && card.text !== '' && (
					<OverlayTrigger
						placement="bottom"
						overlay={<Tooltip>{card.text}</Tooltip>}
						delay={{ show: 50, hide: 400 }}
					>
						<BCard.Img
							variant="top"
							src={card.imageUrl}
							className="img"
						/>
					</OverlayTrigger>
				)}
			</BCard.Body>
		</BCard>
	);
}
