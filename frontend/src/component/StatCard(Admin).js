import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="text-muted mb-2">{title}</Card.Title>
            <h2 className="mb-0">{value}</h2>
          </div>
          {icon && (
            <div className="text-primary" style={{ fontSize: '2rem' }}>
              {icon}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard; 