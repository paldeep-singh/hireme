import { useState } from "react";
import stylex from "@stylexjs/stylex";

const styles = stylex.create({
  button: {
    color: "green",
  },
});

function Card() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <button
        onClick={() => setCount((count) => count + 1)}
        {...stylex.props(styles.button)}
      >
        count is {count}
      </button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
}

export default Card;
