
do(raise(X4), 1) :- (isflop, allekaarten(X1), members([card(X3,X2), card(X3,X2), card(_,X2), card(_,X2), card(_,_)],X1), X2 \= X3), X4 is 4.
do(raise(X9), 2) :- handkaarten(X7), members([card(X8,_), card(X8,_)],X7),  X9 is 2,  ((ispreflop); (handkaarten(X5), members([card(X6,_), card(X6,_)],X5))).
do(call, 3) :- handkaarten(X10), members([card(X11,_), card(X12,_)], X10), X11 >= 9, X12 >= 13,  , ((ispreflop); (handkaarten(X5), members([card(X6,_), card(X6,_)],X5))).
do(fold, 4) :- ((ispreflop); (handkaarten(X5), members([card(X6,_),card(X6,_)],X5))).


do(call, 1) :- handkaarten(X3), members([card(X4,_), card(X5,_)],X3), X4 >= 9, X5 >= 13,  , ((ispreflop); (handkaarten(X1), members([card(X2,_), card(X2,_)],X1))).
do(fold, 2) :- ((ispreflop); (handkaarten(X1), members([card(X2,_), card(X2,_)],X1))).
