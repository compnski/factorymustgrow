export type CounterWithPlusMinusButtonProps = {
  plusClickHandler: () => void;
  minusClickHandler: () => void;
  count: number;
};
export function CounterWithPlusMinusButtons(
  props: CounterWithPlusMinusButtonProps
) {
  return (
    <div className="count-area">
      <div className="plus-minus" onClick={props.minusClickHandler}>
        -
      </div>
      <div className="count">{props.count}</div>
      <div className="plus-minus" onClick={props.plusClickHandler}>
        +
      </div>
    </div>
  );
}
