export function ChoosePlayer({ setPlayer }) {
  return (
    <div id="chooseStart" className="center">
      <button
        type="button"
        id="choose-x"
        className="choose"
        onClick={(e) => {
          console.log("chose Player 1");
          setPlayer("Player1");
        }}
      >
        Start New Game
      </button>
      <button
        type="button"
        id="choose-o"
        className="choose"
        onClick={(e) => {
          console.log("chose Player 2");
          setPlayer("Player2");
        }}
      >
        Join Existing Game
      </button>
    </div>
  );
}
