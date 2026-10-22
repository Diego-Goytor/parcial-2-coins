// src/CryptoList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoList = () => {
    const [cryptos, setCryptos] = useState([]);
    const [cart, setCart] = useState([]);
    const [likedCrypto, setLikedCrypto] = useState(null);

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
                setCryptos(response.data);
            } catch (error) {
                console.error('Error fetching cryptos:', error);
            }
        };
        fetchCryptos();
    }, []);

    const addToCart = (crypto) => {
        setCart(prevCart => [...prevCart, crypto]);
    };

    const removeFromCart = (cryptoId) => {
        setCart(prevCart => {
            const index = prevCart.findIndex(item => item.id === cryptoId);
            if (index !== -1) {
                const newCart = [...prevCart];
                newCart.splice(index, 1);
                return newCart;
            }
            return prevCart;
        });
    };

    const handleLike = (crypto) => {
        setLikedCrypto(prevLiked => (prevLiked && prevLiked.id === crypto.id ? null : crypto));
    };

    const totalQuantity = cart.length;
    const totalPrice = cart.reduce((sum, item) => sum + item.current_price, 0);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Courier New, monospace' }}>
            {/* Secciones de resumen: Carrito y Me gusta */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px', border: '1px solid #007bff', borderRadius: '8px', padding: '15px', backgroundColor: '#eef6ff' }}>
                    <div style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '10px' }}>
                        ----------------------------------<br />
                        -- Carrito de Compras --<br />
                        ----------------------------------
                    </div>
                    <p style={{ margin: '5px 0' }}><strong>Cantidad total:</strong> {totalQuantity} {totalQuantity === 1 ? 'moneda' : 'monedas'}</p>
                    <p style={{ margin: '5px 0' }}><strong>Total acumulado:</strong> ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                </div>

                <div style={{ flex: 1, minWidth: '240px', border: '1px solid #e83e8c', borderRadius: '8px', padding: '15px', backgroundColor: '#fff0f6' }}>
                    <div style={{ color: '#e83e8c', fontWeight: 'bold', marginBottom: '10px' }}>
                        ----------------------------------<br />
                        -- Moneda Favorita --<br />
                        ----------------------------------
                    </div>
                    {likedCrypto ? (
                        <p style={{ margin: '5px 0' }}>
                            Te gusta: <strong>{likedCrypto.name}</strong> ({likedCrypto.symbol.toUpperCase()}) - ${likedCrypto.current_price.toLocaleString()} USD
                        </p>
                    ) : (
                        <p style={{ margin: '5px 0', color: '#666' }}>Aún no le has dado "Me gusta" a ninguna moneda.</p>
                    )}
                </div>
            </div>

            {/* Lista de criptomonedas */}
            <div>
                {cryptos.map(crypto => {
                    const isLiked = likedCrypto && likedCrypto.id === crypto.id;
                    const inCartCount = cart.filter(item => item.id === crypto.id).length;

                    return (
                        <div key={crypto.id} style={{ border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={crypto.image} alt={crypto.name} style={{ width: '40px', height: '40px' }} />
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{crypto.name} <span style={{ fontSize: '0.85em', color: '#666' }}>({crypto.symbol.toUpperCase()})</span></h3>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>Precio: ${crypto.current_price.toFixed(2)} USD</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={() => addToCart(crypto)}
                                    style={{ padding: '8px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}
                                >
                                    -- Agregar al Carrito --
                                </button>

                                {inCartCount > 0 && (
                                    <button 
                                        onClick={() => removeFromCart(crypto.id)}
                                        style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}
                                    >
                                        -- Quitar del Carrito ({inCartCount}) --
                                    </button>
                                )}

                                <button 
                                    onClick={() => handleLike(crypto)}
                                    style={{ padding: '8px 12px', backgroundColor: isLiked ? '#6c757d' : '#e83e8c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}
                                >
                                    {isLiked ? '-- Ya no me gusta --' : '-- Me gusta --'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CryptoList;