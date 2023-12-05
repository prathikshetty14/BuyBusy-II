import styles from "../../styles/myorder.module.css";

export default function OrderDetail(props) {
  // order details from props
  const { date, list, amount, discountedAmount } = props.order;

  return (
    // Order Container
    <div className="">
      {/* Order Date */}
      <h1>Order Placed On: {date}</h1>

      {/* Table of Order Details */}
      <table>

        {/* First Row */}
        <tr>
          <th>S.no</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total Price</th>
        </tr>

        {list.map((product, i) => (
          <tr>
            <td>{i + 1}</td>
            <td>{product.name}</td>
            <td>₹ {product.price}</td>
            <td>x {product.quantity}</td>
            <td>₹ {product.quantity * product.price}</td>
          </tr>
        ))}

        {/* Last Row */}
        <tr>
          <td colSpan={4}>Grand Total</td>
          {discountedAmount === 0 ? (
            <>
              <td>₹ {amount}</td>
            </>
          ) : (
            <>
              <td>₹ <span style={{ textDecoration: "line-through" }}>{amount}</span> <br /> ₹ {discountedAmount}</td>
            </>
          )}
        </tr>
      </table>
    </div>
  );

}
