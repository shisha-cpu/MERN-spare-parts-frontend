const QuantityControl = ({ quantity, onIncrease, onDecrease }) => {
    return (
      <div className="quantity-control">
        <button onClick={onDecrease}>-</button>
        <span>{quantity}</span>
        <button onClick={onIncrease}>+</button>
      </div>
    );
  };

  export default QuantityControl