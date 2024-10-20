import React, { useState, useEffect } from 'react';
import './modal.css';

const Modal1 = ({ isOpen, title, message, userData, onClose, onSave }) => {
    const [formData, setFormData] = useState(userData); // Локальное состояние для редактируемых данных

    useEffect(() => {
        setFormData(userData); // Обновляем данные в форме при открытии модального окна
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); 
    };

    if (!isOpen) return null; 

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Имя:
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                        />
                    </label>
                    <label>
                        Email:
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </label>
                    <label>
                        Телефон:
                        <input 
                            type="text" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit">Сохранить</button>
                        <button type="button" onClick={onClose}>Закрыть</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal1;
