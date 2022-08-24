"reach 0.1";

const [isOutcome, P1_WINS, DRAW, P2_WINS] = makeEnum(3);

const isWinner = (uHands) => {
  const ex = uHands;
  const one = ex[0] * ex[1] * ex[2];
  const two = ex[0] * ex[4] * ex[8];
  const three = ex[0] * ex[3] * ex[6];
  const four = ex[1] * ex[4] * ex[7];
  const five = ex[2] * ex[5] * ex[8];
  const six = ex[2] * ex[4] * ex[6];
  const seven = ex[3] * ex[4] * ex[5];
  const eigth = ex[6] * ex[7] * ex[8];
  const winner =
    one == 1
      ? 0
      : one == 8
      ? 2
      : two == 1
      ? 0
      : two == 8
      ? 2
      : three == 1
      ? 0
      : three == 8
      ? 2
      : four == 1
      ? 0
      : four == 8
      ? 2
      : five == 1
      ? 0
      : five == 8
      ? 2
      : six == 1
      ? 0
      : six == 8
      ? 2
      : seven == 1
      ? 0
      : seven == 8
      ? 2
      : eigth == 1
      ? 0
      : eigth == 8
      ? 2
      : 1;
  return winner;
};

// 0 1 2
// 3 4 5
// 6 7 8

// [0,1,2] 3
// [0,4,8] 12
// [0,3,6] 9
// [1,4,7] 12
// [2,5,8] 15
// [2,4,6] 12
// [3,4,5] 12
// [6,7,8] 21

const Player = {
  ...hasRandom,
  getHand: Fun([], UInt),
  seeOutcome: Fun([UInt], Null),
  seeOutcome2: Fun([UInt], Null),
  informTimeout: Fun([], Null),
  informCompletion: Fun([], Null),
};

export const main = Reach.App(() => {
  const Player1 = Participant("Player1", {
    ...Player,
    wager: UInt,
    deadline: UInt,
  });

  const Player2 = Participant("Player2", {
    ...Player,
    acceptWager: Fun([UInt], Null),
  });
  init();

  const informTimeout = () => {
    each([Player1, Player2], () => {
      interact.informTimeout();
    });
  };
  const informCompletion = () => {
    each([Player1, Player2], () => {
      interact.informCompletion();
    });
  };

  Player1.only(() => {
    const wager = declassify(interact.wager);
    const deadline = declassify(interact.deadline);
  });
  Player1.publish(wager, deadline).pay(wager);
  commit();

  Player2.only(() => {
    interact.acceptWager(wager);
  });
  Player2.pay(wager).timeout(relativeTime(deadline), () =>
    closeTo(Player1, informTimeout)
  );
  commit();

  const board = array(UInt, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  //------------------------------ get first hand ------------------------------------------//
  Player1.only(() => {
    const hand1Player01 = declassify(interact.getHand());
    const hand1Player1 = hand1Player01 < 9 ? hand1Player01 : 9;
    assume(hand1Player1 < 9);
  });
  Player1.publish(hand1Player1).timeout(relativeTime(deadline), () =>
    closeTo(Player2, informTimeout)
  );
  require(hand1Player1 < 9);
  commit();

  const board1 = board.set(hand1Player1, 1);

  Player2.only(() => {
    const hand1Player02 = declassify(interact.getHand());
    const hand1Player2 = hand1Player02 < 9 ? hand1Player02 : 9;
    assume(hand1Player2 < 9);
  });
  Player2.publish(hand1Player2).timeout(relativeTime(deadline), () =>
    closeTo(Player1, informTimeout)
  );
  require(hand1Player2 < 9);
  commit();
  const board11 = board1.set(hand1Player2, 2);

  //------------------------------ get first hand ------------------------------------------//

  //-------------------------------- get second hand --------------------------------------//
  Player1.only(() => {
    const hand2Player01 = declassify(interact.getHand());
    const hand2Player1 = hand2Player01 < 9 ? hand2Player01 : 9;
    assume(hand2Player1 < 9);
  });
  Player1.publish(hand2Player1).timeout(relativeTime(deadline), () =>
    closeTo(Player2, informTimeout)
  );
  require(hand2Player1 < 9);
  commit();
  const board2 = board11.set(hand2Player1, 1);

  Player2.only(() => {
    const hand2Player02 = declassify(interact.getHand());
    const hand2Player2 = hand2Player02 < 9 ? hand2Player02 : 9;
    assume(hand2Player2 < 9);
  });
  Player2.publish(hand2Player2).timeout(relativeTime(deadline), () =>
    closeTo(Player1, informTimeout)
  );
  require(hand2Player2 < 9);
  commit();
  const board22 = board2.set(hand2Player2, 2);
  //-------------------------------- get second hand --------------------------------------//

  //--------------------------------- get third hand --------------------------------------//
  Player1.only(() => {
    const hand3Player01 = declassify(interact.getHand());
    const hand3Player1 = hand3Player01 < 9 ? hand3Player01 : 9;
    assume(hand3Player1 < 9);
    const board3 = board22.set(hand3Player1, 1);
    const p1win3 = isWinner(board3);
  });
  Player1.publish(hand3Player1, p1win3).timeout(relativeTime(deadline), () =>
    closeTo(Player2, informTimeout)
  );
  commit();

  each([Player1, Player2], () => {
    interact.seeOutcome(p1win3);
  });

  const [timeRemaining31, keepGoing31] = makeDeadline(
    p1win3 == 0 ? 0 : deadline
  );

  Player1.publish(board3)
    .when(p1win3 != 0)
    .timeout(timeRemaining31(), () => closeTo(Player1, informCompletion));
  commit();

  Player2.only(() => {
    const hand3Player02 = declassify(interact.getHand());
    const hand3Player2 = hand3Player02 < 9 ? hand3Player02 : 9;
    assume(hand3Player2 < 9);
    const board33 = board3.set(hand3Player2, 2);
    const p2win3 = isWinner(board33);
  });

  Player2.publish(hand3Player2, p2win3).timeout(relativeTime(deadline), () =>
    closeTo(Player1, informTimeout)
  );
  commit();

  each([Player1, Player2], () => {
    interact.seeOutcome(p2win3);
  });
  const [timeRemaining32, keepGoing32] = makeDeadline(
    p2win3 == 2 ? 0 : deadline
  );
  Player2.publish(board33)
    .when(p2win3 != 2)
    .timeout(timeRemaining32(), () => closeTo(Player2, informTimeout));
  commit();

  //--------------------------------- get third hand --------------------------------------//

  //--------------------------------- get fourth hand --------------------------------------//
  Player1.only(() => {
    const hand4Player01 = declassify(interact.getHand());
    const hand4Player1 = hand4Player01 < 9 ? hand4Player01 : 9;
    assume(hand4Player1 < 9);
    const board4 = board33.set(hand4Player1, 1);
    const p1win4 = isWinner(board4);
  });

  Player1.publish(hand4Player1, p1win4).timeout(relativeTime(deadline), () =>
    closeTo(Player2, informTimeout)
  );
  commit();

  each([Player1, Player2], () => {
    interact.seeOutcome(p1win4);
  });

  const [timeRemaining41, keepGoing41] = makeDeadline(
    p1win4 == 0 ? 0 : deadline
  );

  Player1.publish(board4)
    .when(p1win4 != 0)
    .timeout(timeRemaining41(), () => closeTo(Player1, informCompletion));
  commit();

  Player2.only(() => {
    const hand4Player02 = declassify(interact.getHand());
    const hand4Player2 = hand4Player02 < 9 ? hand4Player02 : 9;
    assume(hand4Player2 < 9);
    const board44 = board4.set(hand4Player2, 2);
    const p2win4 = isWinner(board44);
  });

  Player2.publish(hand4Player2, p2win4).timeout(relativeTime(deadline), () =>
    closeTo(Player1, informTimeout)
  );
  commit();

  each([Player1, Player2], () => {
    interact.seeOutcome(p2win4);
  });
  const [timeRemaining42, keepGoing42] = makeDeadline(
    p2win4 == 2 ? 0 : deadline
  );
  Player2.publish(board44)
    .when(p2win4 != 2)
    .timeout(timeRemaining42(), () => closeTo(Player2, informTimeout));
  commit();

  //--------------------------------- get fourth hand --------------------------------------//

  //--------------------------------- get fifth hand --------------------------------------//
  Player1.only(() => {
    const hand5Player01 = declassify(interact.getHand());
    const hand5Player1 = hand5Player01 < 9 ? hand5Player01 : 9;
    assume(hand5Player1 < 9);
    const board5 = board44.set(hand5Player1, 1);
    const p1win5 = isWinner(board4);
  });

  Player1.publish(hand5Player1, p1win5).timeout(relativeTime(deadline), () =>
    closeTo(Player2, informTimeout)
  );
  commit();

  each([Player1, Player2], () => {
    interact.seeOutcome(p1win5);
  });

  const [timeRemaining51, keepGoing51] = makeDeadline(
    p1win5 == 0 ? 0 : deadline
  );

  Player1.publish(board5)
    .when(p1win5 != 0)
    .timeout(timeRemaining51(), () => closeTo(Player1, informCompletion));

  //--------------------------------- get fifth hand --------------------------------------//

  each([Player1, Player2], () => {
    interact.seeOutcome(1);
  });
  transfer(wager).to(Player1);
  transfer(wager).to(Player2);
  informCompletion();
  commit();
});
