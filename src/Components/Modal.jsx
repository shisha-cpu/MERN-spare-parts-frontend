import React from 'react';
import './modal.css';

export default function Modal({ isOpen, onClose, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}
