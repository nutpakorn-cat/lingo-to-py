const fs = require('fs');

const lingoCode = `


! Age 0 - 14;
		! calf with 0 month;			@for(time(t) : AM(t) = AM1(t) + AM2(t));
								AM0 = AM10 + AM20;
								@for(time(t) : @for(age1(a) | a #EQ# 1 : AHerd(a,t) = AH(t)+AM(t)));

								@for(links5(a,t) | a #GT# 2 #AND# a #LE# 6 #AND# t #EQ# 1 : AHerd(a,t) = AHerd0(a-1));
								@for(links5(a,t) | a #EQ# 2 #AND# t #EQ# 1 : AHerd(a,t) = AHerd0(a-1) + AH0 + AM0);					
		! Initial AHerd structure;		@for(links5(a,t) | a #GT# 6 #AND# t #EQ# 1 : AHerd(a,t) = AHerd0(a-1) +AX(a,t) -AY(a,t));
					
		! AHerd Structure Balance;		@for(links5(a,t) | a #GE# 2 #AND# a #LE# 6 #AND# t #GT# 1 : AHerd(a,t) = AHerd(a-1,t-1));
								@for(links5(a,t) | a #GE# 6 #AND# t #GT# 1 : AHerd(a,t) = AHerd(a-1,t-1)+AX(a,t)-AY(a,t));
		
		! Not buy between 0 - 5 months;	@for(links5(a,t) | a #GE# 1 #AND# a #LT# 6 : AX(a,t) = 0);
		! Not sell between 0 - 5 months;	@for(links5(a,t) | a #GE# 1 #AND# a #LT# 6 : AY(a,t) = 0);

								@for(links5(a,t) | a #GE# 6  : AX(a,t) <= 10);
								@for(links5(a,t) | a #GE# 6  : AY(a,t) <= 100);

		! Change status;				@for(age1(a) | a #EQ# 15 : @for(time(t) | t #EQ# 1 : AHerd0(a)+AX(a,t)-AY(a,t) = BH0));
								@for(links5(a,t) | a #EQ# 15 : AHerd(a,t) = BH(t)); 

		! Boundary;						@for(time(t) :		@SUM(age1(a) | a #GT# 1 : AHerd(a,t)) <= 1500  ;
													@SUM(age1(a) | a #GT# 1 : AHerd(a,t)) >= 800 ;
								);

								AHerdTotal = @SUM(age1(a) : AHerd0(a));
								@for(time(t) : ATotal(t) = @SUM(age1(a): AHerd(a,t)));

! Age 15 - 18;

								@for(links6(a,t) | t #EQ# 1 			 : BX(a,t) <= 50);
								@for(links6(a,t) | a #LT# 4 #AND# t #EQ# 1 : BY(a,t) <= 20);
								@for(links6(a,t) | t #GT# 1			 : BX(a,t) <= 50);
								@for(links6(a,t) | a #LT# 4 #AND# t #GT# 1 : BY(a,t) <= 20);
								@for(links6(a,t) : BHerd(a,t) >= 100);

		!heifers with 15 M change from calf;				

					!Initial;		@for(age2(a) | a #EQ# 1: @for(time(t) | t #EQ# 1 :
									BHerd(a,t) = BH0 + BX(a,t) - BY(a,t) - BZ(a,t)));
					!change;		@for(age2(a) | a #EQ# 1: @for(time(t) | t #GT# 1:
									BHerd(a,t) = BH(t-1) + BX(a,t) - BY(a,t) - BZ(a,t)));


		! Herd Structure Balance;

					!Initial;		@for(age2(a) | a #GT# 1: @for(time(t) | t #EQ# 1:
									BHerd(a,t) = BHerd1(a-1) + BX(a,t) - BY(a,t)));
								@for(age2(a) | a #GT# 1: @for(time(t) | t #GT# 1:
									BHerd(a,t) = BHerd(a-1,t-1) + BX(a,t) - BY(a,t)));

		! AI Success;				@for(age2(a): @for(time(t): BZ(a,t) = BR*BHerd(a,t)));
								@for(age2(a): BZ0	= BR*BHerd0(a));
								@for(age2(a): BHerd1(a) = BHerd0(a) - BZ0);

								@for(time(t) | t #GE# 2: @for(age2(a) | a #EQ# 4: BY(a,t) = BHerd(a-1,t-1) - BZ(a,t)));

		! boundaries;				@for(time(t) : 	@SUM(age2(a) : BHerd(a,t)) <= 1000;
											!@SUM(age2(a) : BHerd(a,t)) >= 100;
								);
	
		! Change stucture;			@for(links6(a,t) | a #GE# 1 #AND# t #GE# 1 	: (BZ(a,t) - BAR*BZ(a,t)) = CB(a,t));
								@for(age2(a) : @for(time(t) | t #EQ# 1 		: (BZ0(a) - BAR*BZ0(a)) = CB0(a)));


								@for(time(t): BTotal(t) = @SUM(age2(a): BHerd(a,t)));


! Heifers with first pregnant;
	
	! Boundary of Buy-Sell;				
								! a = 15;

								@for(links7(a,t,b)| a #EQ# 1 #AND# b #EQ# 1 : CX(a,t,b) <= 150 ; CY(a,t,b) <= 30; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 1 #AND# b #GT# 1 : CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 16;
								@for(links7(a,t,b)| a #EQ# 2 #AND# b #LE# 2: CX(a,t,b) <= 150 ; CY(a,t,b) <= 30; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 2 #AND# b #GT# 2: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 17;
								@for(links7(a,t,b)| a #EQ# 3 #AND# b #LE# 3: CX(a,t,b) <= 150 ; CY(a,t,b) <= 30; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 3 #AND# b #GT# 3: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 18;
								@for(links7(a,t,b)| a #EQ# 4 #AND# b #LE# 4: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 4 #AND# b #GT# 4: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 19;
								@for(links7(a,t,b)| a #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2: CX(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 20;
								@for(links7(a,t,b)| a #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 21;
								@for(links7(a,t,b)| a #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 22;
								@for(links7(a,t,b)| a #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 23;
								@for(links7(a,t,b)| a #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 8 #AND# b #EQ# 9 #AND# b #LT# 5: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 24;
								@for(links7(a,t,b)| a #EQ# 9 #AND# b #LE# 9 #AND# b #GE# 6: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 9 #AND# b #GT# 9 #AND# b #LT# 6: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 25;
								@for(links7(a,t,b)| a #EQ# 10 #AND# b #LE# 9 #AND# b #GE# 7: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 10 #AND# b #GT# 9 #AND# b #LT# 7: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 26;
								@for(links7(a,t,b)| a #EQ# 11 #AND# b #LE# 9 #AND# b #GE# 8: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 11 #AND# b #GT# 9 #AND# b #LT# 8: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);

								! a = 24;
								@for(links7(a,t,b)| a #EQ# 12 #AND# b #LE# 9 #AND# b #GE# 9: CX(a,t,b) <= 150 ; CY(a,t,b) <= 20; CHerd(a,t,b) >= 10;);
								@for(links7(a,t,b)| a #EQ# 12 #AND# b #GT# 9 #AND# b #LT# 9: CX(a,t,b) = 0; CY(a,t,b) = 0; CHerd(a,t,b) = 0;);
								

								

	! change from Heifers;				@for(age2(a) : @for(age3(a) : @for(time(t) | t #EQ# 1 : @for(gestation(b) | b #EQ# 1:
									CHerd(a,t,b) = CB0(a) + CX(a,t,b) - CY(a,t,b)))));
								@for(age2(a) : @for(age3(a) : @for(time(t) | t #GT# 1 : @for(gestation(b) | b #EQ# 1:
									CHerd(a,t,b) = CB(a,t-1) + CX(a,t,b) - CY(a,t,b)))));

	! Herd Structure Balance;			

		! Initial;					@for(age3(a) | a #GT# 1 : @for(time(t) | t #EQ# 1 : @for(gestation(b) | b #GT# 1 :
									CHerd(a,t,b) = CHerd0(a-1,b-1) + CX(a,t,b) - CY(a,t,b))));
								@for(age3(a) | a #GT# 1 : @for(time(t) | t #GT# 1 : @for(gestation(b) | b #GT# 1 :
									CHerd(a,t,b) = CHerd(a-1,t-1,b-1) + CX(a,t,b) - CY(a,t,b))));

	! Boundaries;					@for(time(t) :	@SUM(age3(a) : @SUM(gestation(b) | b #LT# 9 : CHerd(a,t,b))) <= 1000;
											!@SUM(age3(a) : @SUM(gestation(b) | b #LT# 9 : CHerd(a,t,b))) >= 800;
								);

	! Heifers with 0 month;				@for(gestation(b) | b #EQ# 9: @for(time(t) : AH(t) = @SUM(age3(a) | a #GE# 9 : FR*CHerd(a,t,b)))); !** use @ROUNDUP make local opt.;
	
	! Culf with 0 months in initial;		@for(gestation(b) | b #EQ# 9: AH0 = @SUM(age3(a) | a #GE# 9 : FR*CHerd0(a,b)));

	! change status to Cattle;			@for(gestation(b) | b #EQ# 9: @for(age3(a) | a #GE# 9: @for(time(t) : CHerd(a,t,b) = DC(a,t))));
								@for(links11(a,b) | b #EQ# 9 #AND# a #GE# 9 : DC0(a) = CHerd0(a,b));		

								@for(time(t): Ctotal(t) = @SUM(gestation(b): @SUM(age3(a) | a #LT# 9: CHerd(a,t,b))));

! Cattle with First Lactation;

								@for(links8(ab,t,r)  | ab #EQ# 1 #AND# r #LE# 1 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 2 #AND# r #LE# 2 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 3 #AND# r #lE# 3 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 4 #AND# r #LE# 4 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 5 #AND# r #LE# 5 #AND# r #GE# 2 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 6 #AND# r #LE# 6 #AND# r #GE# 3 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 7 #AND# r #LE# 7 #AND# r #GE# 4 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 8 #AND# r #LE# 8 #AND# r #GE# 5 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 9 #AND# r #LE# 9 #AND# r #GE# 6 : D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 10 #AND# r #LE# 10 #AND# r #GE# 7:D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 11 #AND# r #GE# 8: D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								@for(links8(ab,t,r)  | ab #EQ# 12 #AND# r #GE# 9: D1Y(ab,t,r) <= 10; D1X(ab,t,r) <= 100; D1Herd(ab,t,r) >= 5;);
								
								@for(links8(ab,t,r)  | ab #EQ# 1 #AND# r #GT# 1 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 2 #AND# r #GT# 2 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 3 #AND# r #GT# 3 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 4 #AND# r #GT# 4 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 5 #AND# r #LT# 2 #AND# r #GT# 5 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 6 #AND# r #LT# 3 #AND# r #GT# 6 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 7 #AND# r #LT# 4 #AND# r #GT# 7 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 8 #AND# r #LT# 5 #AND# r #GT# 8 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 9 #AND# r #GT# 9 #AND# r #LT# 6 : D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 10 #AND# r #LT# 7: D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 11 #AND# r #LT# 8: D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);
								@for(links8(ab,t,r)  | ab #EQ# 12 #AND# r #LT# 9: D1Y(ab,t,r) <= 0; D1X(ab,t,r) <= 0; D1Herd(ab,t,r) <= 0;);


! Change from C to D;				
								
		! Intitial;					@for(age3(a) | a #EQ# 9 : @for(age4(ab) | ab #EQ# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 2:
									DC0(a) + D1Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) = D1Herd(ab,t,r)))));
								@for(age3(a) | a #EQ# 10 : @for(age4(ab) | ab #EQ# 3 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 2: 
									DC0(a) + D1Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) = D1Herd(ab,t,r)))));
								@for(age3(a) | a #EQ# 11 : @for(age4(ab) | ab #EQ# 4 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 2: 
									DC0(a) + D1Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) = D1Herd(ab,t,r)))));
								@for(age3(a) | a #EQ# 12 : @for(age4(ab) | ab #EQ# 5 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 2: 
									DC0(a) + D1Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) = D1Herd(ab,t,r)))));

								@for(age4(ab) | ab #EQ# 1 : @for(age3(a) | a #EQ# 9 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 1 : 
									D1Herd(ab,t,r) = DC(a,t) + D1X(ab,t,r) - D1Y(ab,t,r)))));
								@for(age4(ab) | ab #EQ# 2 : @for(age3(a) | a #EQ# 10 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 1 : 
									D1Herd(ab,t,r) = DC(a,t) + D1X(ab,t,r) - D1Y(ab,t,r)))));
								@for(age4(ab) | ab #EQ# 3 : @for(age3(a) | a #EQ# 11 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 1 : 
									D1Herd(ab,t,r) = DC(a,t) + D1X(ab,t,r) - D1Y(ab,t,r)))));
								@for(age4(ab) | ab #EQ# 4 : @for(age3(a) | a #EQ# 12 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 1 : 
									D1Herd(ab,t,r) = DC(a,t) + D1X(ab,t,r) - D1Y(ab,t,r)))));
									
	! Initial Herd structure;			
								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 3:
									D1Herd(ab,t,r) = D1Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) - D1Z(ab,t,r))));

								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 4:
									D1Herd(ab,t,r) = D1Herd1(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) - D1Z(ab,t,r))));

								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 5:
									D1Herd(ab,t,r) = D1Herd1(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) - D1Z(ab,t,r))));

								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 6:
									D1Herd(ab,t,r) = D1Herd1(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) - D1Z(ab,t,r))));
					
								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 7:
									D1Herd(ab,t,r) = D1Herd1(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r))));

								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #GT# 7:
									D1Herd(ab,t,r) = D1Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r))));

								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #GE# 2 : @for(milking(r) | r #EQ# 2:
									D1Herd(ab,t,r) = D1Herd(ab-1,t-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r))));

								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #GE# 2 : @for(milking(r) | r #GE# 3 #AND# r #LE# 6:
									D1Herd(ab,t,r) = D1Herd(ab-1,t-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r) - D1Z(ab,t,r))));

								@for(age3(ab) | ab #GE# 2 : @for(time(t) | t #GE# 2 : @for(milking(r) | r #GE# 7:
									D1Herd(ab,t,r) = D1Herd(ab-1,t-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r))));


	! AI Success;					@for(links8(ab,t,r) | r #GE# 3 #AND# r #LE# 6 : D1Z(ab,t,r) = DR*D1Herd(ab,t,r));
								@for(links13(ab,r) | r #GE# 3 #AND# r #LE# 6 : D1Z0(ab,r) = DR*D1Herd0(ab,r));
								@for(links13(ab,r) | r #GE# 3 #AND# r #LE# 6 : D1Herd1(ab,r) = D1Herd0(ab,r) - D1Z0(ab,r));

	! sell all;						@for(links8(ab,t,r) | ab #GE# 2 #AND# t #GE# 2 #AND# r #EQ# 10 : D1Y(ab,t,r) = D1Y(ab-1,t-1,r-1) - D1Z(ab,t,r));

	! change status to preg 2;			@for(age4(ab) | ab #GE# 3 : @for(time(t) | t #GE# 2 : @for(milking(r) | r #GE# 4 : D1Z(ab-1,t-1,r-1) = DE1(ab,t,r))));
								@for(age4(ab) | ab #GE# 4 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #GE# 4 : D1Z0(ab-1,r-1) = DE1(ab,t,r))));

	! Boudaries;						@for(time(t): @SUM(links8(ab,t,r) : D1Herd(ab,t,r)) >= 200);
									@for(time(t): @SUM(links8(ab,t,r) : D1Herd(ab,t,r)) <= 800);


! Heifers with first pregnant;

							! r = 4;

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 1 #AND# b #LE# 1 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5; );
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 1 #AND# b #LE# 1 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20;  E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 1 #AND# b #LE# 1 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20;  E1Herd(a,t,rr,b) >= 5; );
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 1 #AND# b #LE# 1 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5; );

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 1 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 1 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 1 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 1 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);														

							! r = 5;
								
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 2 #AND# b #LE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20;  E1Herd(a,t,rr,b) >= 10; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 2 #AND# b #LE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20;  E1Herd(a,t,rr,b) >= 10; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 2 #AND# b #LE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20;  E1Herd(a,t,rr,b) >= 10; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 2 #AND# b #LE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20;  E1Herd(a,t,rr,b) >= 10; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 1 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 2 #AND# b #GT# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 2 #AND# b #GT# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 2 #AND# b #GT# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);

							! r = 6;
								
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 3 #AND# b #LE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 3 #AND# b #LE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 3 #AND# b #LE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 3 #AND# b #LE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 3 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 3 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 3 #AND# b #GT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 3 #AND# b #GT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 3 #AND# b #GT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 3 #AND# b #GT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0; 	E1Herd(a,t,rr,b) <= 0;);	


							! r = 7;
								
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 4 #AND# b #LE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 4 #AND# b #LE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 4 #AND# b #LE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 4 #AND# b #LE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 4 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 4 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 4 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 4 #AND# b #GT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 4 #AND# b #GT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 4 #AND# b #GT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 4 #AND# b #GT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	


							! r = 8;
								
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 5 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 5 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 5 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 5 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	



							! r = 9;
					
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);


								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 6 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 6 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 6 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 6 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 6 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	



							! r = 10;
								
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 7 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 7 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 7 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 7 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 7 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 7 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	


							! r = 11;
								
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 8 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 8 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 8 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 8 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 8 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 8 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 8 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	


							! r = 12;

								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20; E1Herd(a,t,rr,b) >= 5;);
								
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 9 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 9 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 9 #AND# b #GT# 1 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 9 #AND# b #LT# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 9 #AND# b #LT# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 9 #AND# b #LT# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 9 #AND# b #LT# 6 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 9 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 9 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 9 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	


							! r = 13;
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 10; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 10; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 10; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 10; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 10 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 10 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 10 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 10 #AND# b #LT# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 10 #AND# b #LT# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 10 #AND# b #LT# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 10 #AND# b #LT# 7 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 10 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);	


							! r = 14;
								
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 5; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 5; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 5; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 5; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 11: E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 11 #AND# b #LT# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 11 #AND# b #LT# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 11 #AND# b #LT# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 11 #AND# b #LT# 8 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 11 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 10;);

							! r = 15;
								
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 12 #AND# b #GE# 9 : E1X(a,t,rr,b) <= 50;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 12 #AND# b #GE# 9 : E1X(a,t,rr,b) <= 50;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 12 #AND# b #GE# 9 : E1X(a,t,rr,b) <= 50;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 12 #AND# b #GE# 9 : E1X(a,t,rr,b) <= 50;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);

								@for(links9(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 12 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 12: E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 12: E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 12 #AND# b #LT# 9 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 12 #AND# b #LT# 9 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 12 #AND# b #LT# 9 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);
								@for(links9(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 12 #AND# b #LT# 9 : E1X(a,t,rr,b) <= 0;	E1Y(a,t,rr,b) <= 0;	E1Herd(a,t,rr,b) <= 0;);

		! change status from cattle with first pregnant in 24 months and second pregnant in 26 - 29 months ;
			
								@for(age4(ab) | ab #EQ# 4 : @for(age5(a) | a #EQ# 1  : @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 4: @for(milkingE(rr) | rr #EQ# 1:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 5 : @for(age5(a) | a #EQ# 2: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 5 : @for(milkingE(rr) | rr #EQ# 2:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 6 : @for(age5(a) | a #EQ# 3: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 6: @for(milkingE(rr) | rr #EQ# 3:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 7 : @for(age5(a) | a #EQ# 4: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 7: @for(milkingE(rr) | rr #EQ# 4:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
		
		! change status from cattle with first pregnant in 25 months and second pregnant in 27 - 30 months;

								@for(age4(ab) | ab #EQ# 5 : @for(age5(a) | a #EQ# 2: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 4: @for(milkingE(rr) | rr #EQ# 1:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 6 : @for(age5(a) | a #EQ# 3: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 5 : @for(milkingE(rr) | rr #EQ# 2:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 7 : @for(age5(a) | a #EQ# 4: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 6: @for(milkingE(rr) | rr #EQ# 3:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 8 : @for(age5(a) | a #EQ# 5: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 7: @for(milkingE(rr) | rr #EQ# 4:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));


		! change status from cattle with first pregnant in 26 months and second pregnant in 28 - 31 months;

								@for(age4(ab) | ab #EQ# 6 : @for(age5(a) | a #EQ# 3: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 4: @for(milkingE(rr) | rr #EQ# 1:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 7 : @for(age5(a) | a #EQ# 4: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 5 : @for(milkingE(rr) | rr #EQ# 2:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 8 : @for(age5(a) | a #EQ# 5: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 6: @for(milkingE(rr) | rr #EQ# 3:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 9 : @for(age5(a) | a #EQ# 6: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 7: @for(milkingE(rr) | rr #EQ# 4:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								
		! change status from cattle with first pregnant in 27 months and second pregnant in 29 - 32 months;

								@for(age4(ab) | ab #EQ# 7 : @for(age5(a) | a #EQ# 4  : @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 4: @for(milkingE(rr) | rr #EQ# 1:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 8 : @for(age5(a) | a #EQ# 5: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 5 : @for(milkingE(rr) | rr #EQ# 2:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 9 : @for(age5(a) | a #EQ# 6: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 6: @for(milkingE(rr) | rr #EQ# 3:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));
								@for(age4(ab) | ab #EQ# 10 : @for(age5(a) | a #EQ# 7: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking(r) | r #EQ# 7: @for(milkingE(rr) | rr #EQ# 4:
									E1Herd(a,t,rr,b) = DE1(ab,t,r) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))))));

		! initial change structure;		@for(age5(a) | a #GE# 2: @for(time(t) | t #EQ# 1 : @for(gestation(b) | b #GE# 2: @for(milkingE(rr) | rr #GE# 2 #AND# rr #LE# 6:
									E1Herd(a,t,rr,b) = E1Herd0(a-1,rr-1,b-1) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))));

								@for(age5(a) | a #GE# 2: @for(time(t) | t #EQ# 1 : @for(gestation(b) | b #GE# 2: @for(milkingE(rr) | rr #GE# 7 :
									E1Herd(a,t,rr,b) = E1Herd0(a-1,rr-1,b-1) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b)))));

								@for(links9(a,t,rr,b) | a #GE# 2 #AND# t #GE# 2 #AND# b #GE# 2 #AND# rr #GE# 2:
									E1Herd(a,t,rr,b) = E1Herd(a-1,t-1,rr-1,b-1) + E1X(a,t,rr,b) - E1Y(a,t,rr,b) - E1Abt(a,t,rr,b));

		! Calf 0 months;				@for(time(t) : @for(gestation(b) | b #EQ# 9 : AM1(t) = @SUM(milkingE(rr) | rr #GE# 8 : @SUM(age5(a) | a #GE# 9 : FR*E1Herd(a,t,rr,b)))));
								@for(gestation(b) | b #EQ# 9: AM10 = @SUM(milkingE(rr) | rr #GE# 8 : @SUM(age5(a) | a #GE# 9 : FR*E1Herd0(a,rr,b))));								
								

		! Change status;				@for(age5(a) | a #GE# 9 : @for(gestation(b) | b #EQ# 9: @for(time(t) :
									(@SUM(milkingE(rr) | rr #GE# 7: E1Herd(a,t,rr,b))) =  ED1(a,t))));
								@for(age5(a) | a #GE# 9 : @for(gestation(b) | b #EQ# 9:
									(@SUM(milkingE(rr) | rr #GE# 7: E1Herd0(a,rr,b))) = ED10(a)));

		! ABortion;					@for(age5(a) : @for(gestation(b) : @for(milkingE(rr): @for(time(t):
									E1Abt(a,t,rr,b) = BAR*E1Herd(a,t,rr,b)))));

		! Sell Abortion;				@for(age5(a) : @for(milkingE(rr) | rr #GE# 7: @for(time(t):
									@SUM(gestation(b) : E1Abt(a,t,rr,b)) = E1AbSell(a,t,rr))));


	! Boundaries;					!@for(time(t) : @SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: E1Herd(a,t,rr,b)))) >= 600);
								@for(time(t) : @SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: E1Herd(a,t,rr,b)))) <= 1000);


! Heifers without pregnant lactation 2;


								@for(links10(ab,t,r)  | ab #EQ# 1 #AND# r #LE# 1 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 2 #AND# r #LE# 2 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 3 #AND# r #lE# 3 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 4 #AND# r #LE# 4 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 5 #AND# r #LE# 5 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 6 #AND# r #LE# 6 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 7 #AND# r #LE# 7 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 8 #AND# r #LE# 8 #AND# r #GE# 2 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 9 #AND# r #LE# 9 #AND# r #GE# 3 : D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 10 #AND# r #GE# 4: D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 11 #AND# r #GE# 5: D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 12 #AND# r #GE# 6: D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 13 #AND# r #GE# 7: D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 14 #AND# r #GE# 8: D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 15 #AND# r #GE# 9: D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								@for(links10(ab,t,r)  | ab #EQ# 16 #AND# r #GE# 10: D2Y(ab,t,r) <= 20; D2X(ab,t,r) <= 100; D2Herd(ab,t,r) >= 5;);
								
								@for(links10(ab,t,r)  | ab #EQ# 1 #AND# r #GT# 1 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 2 #AND# r #GT# 2 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 3 #AND# r #GT# 3 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 4 #AND# r #GT# 4 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 5 #AND# r #GT# 5 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 6 #AND# r #GT# 6 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 7 #AND# r #GT# 7 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 8 #AND# r #LT# 2 #AND# r #GT# 8 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 9 #AND# r #LT# 3 #AND# r #GT# 9 : D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 10 #AND# r #LT# 4 #AND# r #GT# 7: D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 11 #AND# r #LT# 5: D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 12 #AND# r #LT# 6: D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 13 #AND# r #LT# 7: D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 14 #AND# r #LT# 8: D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 15 #AND# r #LT# 9: D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );
								@for(links10(ab,t,r)  | ab #EQ# 16 #AND# r #LT# 9: D2Y(ab,t,r) <= 0; D2X(ab,t,r) <= 0;	D2HErd(ab,t,r) <= 0; );

			! change status from initial;	
				
							@for(time(t) | t #EQ# 1:
	
								@for(age5(a) | a #EQ# 10 : @for(age6(ab) | ab #EQ# 2 : @for(milking2(r) | r #EQ# 2:
									D2Herd(ab,t,r) = ED10(a-1) + D2Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r); )));
								@for(age5(a) | a #EQ# 11 : @for(age6(ab) | ab #EQ# 3 : @for(milking2(r) | r #EQ# 2: 
									D2Herd(ab,t,r) = ED10(a-1) + D2Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r); )));
								@for(age5(a) | a #EQ# 12 : @for(age6(ab) | ab #EQ# 4 : @for(milking2(r) | r #EQ# 2: 
									D2Herd(ab,t,r) = ED10(a-1) + D2Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r); )));
								@for(age5(a) | a #EQ# 13 : @for(age6(ab) | ab #EQ# 5 : @for(milking2(r) | r #EQ# 2:
									D2Herd(ab,t,r) = ED10(a-1) + D2Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r); )));
								@for(age5(a) | a #EQ# 14 : @for(age6(ab) | ab #EQ# 6 : @for(milking2(r) | r #EQ# 2: 
									D2Herd(ab,t,r) = ED10(a-1) + D2Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r); )));
								@for(age5(a) | a #EQ# 15 : @for(age6(ab) | ab #EQ# 7 : @for(milking2(r) | r #EQ# 2: 
									D2Herd(ab,t,r) = ED10(a-1) + D2Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r); )));
								@for(age5(a) | a #EQ# 16 : @for(age6(ab) | ab #EQ# 8 : @for(milking2(r) | r #EQ# 2: 
									D2Herd(ab,t,r) = ED10(a-1) + D2Herd0(ab-1,r-1) + D1X(ab,t,r) - D1Y(ab,t,r); )));

							);

			! change status from E;		@for(age5(a) | a #EQ# 9 : @for(age6(ab) | ab #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 1 : 
									D2Herd(ab,t,r) = ED1(a,t) + D2X(ab,t,r) - D2Y(ab,t,r);))));
								@for(age5(a) | a #EQ# 10 : @for(age6(ab) | ab #EQ# 2 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 1 : 
									D2Herd(ab,t,r) = ED1(a,t) + D2X(ab,t,r) - D2Y(ab,t,r);))));
								@for(age5(a) | a #EQ# 11 : @for(age6(ab) | ab #EQ# 3 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 1 : 
									D2Herd(ab,t,r) = ED1(a,t) + D2X(ab,t,r) - D2Y(ab,t,r);))));
								@for(age5(a) | a #EQ# 12 : @for(age6(ab) | ab #EQ# 4 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 1 : 
									D2Herd(ab,t,r) = ED1(a,t) + D2X(ab,t,r) - D2Y(ab,t,r) ;))));
								@for(age5(a) | a #EQ# 13 : @for(age6(ab) | ab #EQ# 5 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 1 : 
									D2Herd(ab,t,r) = ED1(a,t) + D2X(ab,t,r) - D2Y(ab,t,r);))));
								@for(age5(a) | a #EQ# 14 : @for(age6(ab) | ab #EQ# 6 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 1 : 
									D2Herd(ab,t,r) = ED1(a,t) + D2X(ab,t,r) - D2Y(ab,t,r);))));
								@for(age5(a) | a #EQ# 15 : @for(age6(ab) | ab #EQ# 7 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 1 : 
									D2Herd(ab,t,r) = ED1(a,t) + D2X(ab,t,r) - D2Y(ab,t,r);))));
									

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 3:
									D2Herd(ab,t,r) = D2Herd0(ab-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r) - D2Z(ab,t,r))));

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 4:
									D2Herd(ab,t,r) = D2Herd0(ab-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r) - D2Z(ab,t,r))));

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 5:
									D2Herd(ab,t,r) = D2Herd0(ab-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r) - D2Z(ab,t,r))));

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 6:
									D2Herd(ab,t,r) = D2Herd0(ab-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r) - D2Z(ab,t,r))));
					
								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #EQ# 7:
									D2Herd(ab,t,r) = D2Herd0(ab-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r))));

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #EQ# 1 : @for(milking(r) | r #GT# 7:
									D2Herd(ab,t,r) = D2Herd0(ab-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r))));

		! Herd Structure balance;

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #GE# 2 : @for(milking(r) | r #EQ# 2:
									D2Herd(ab,t,r) = D2Herd(ab-1,t-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r))));

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #GE# 2 : @for(milking(r) | r #GE# 3 #AND# r #LE# 6:
									D2Herd(ab,t,r) = D2Herd(ab-1,t-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r) - D2Z(ab,t,r))));

								@for(age6(ab) | ab #GE# 2 : @for(time(t) | t #GE# 2 : @for(milking(r) | r #GE# 7:
									D2Herd(ab,t,r) = D2Herd(ab-1,t-1,r-1) + D2X(ab,t,r) - D2Y(ab,t,r))));
								

	! AI Success;
			! Initial;				@for(age6(ab) | ab #GE# 2: @for(milking2(r) | r #GE# 3 #AND# r #LE# 6:
									D2Z0(ab,r) = DR*D2Herd0(ab,r)));

								@for(age6(ab) | ab #GE# 2: @for(milking2(r) | r #GE# 3 #AND# r #LE# 6:
									D2Herd1(ab,r) = D2Herd0(ab,r) - D2Z0(ab,r)));

								@for(age6(ab) | ab #GE# 2: @for(milking2(r) | r #GE# 3 #AND# r #LE# 6: @for(time(t):
									D2Z(ab,t,r) = DR*D2Herd(ab,t,r))));

								@for(age6(ab) | ab #GE# 2: @for(milking2(r) | r #GE# 4 #AND# r #LE# 7: @for(time(t) | t #GE# 2:
									DE2(ab,t,r) = D2Z(ab-1,t-1,r-1))));

	! Boundaries;					!@for(time(t): @SUM(age6(ab): @SUM(milking2(r): D2Herd(ab,t,r))) >= 400);
								@for(time(t): @SUM(age6(ab): @SUM(milking2(r): D2Herd(ab,t,r))) <= 1000);



! E / second lactation/ ;

							! r = 4;

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 1 #AND# b #LE# 1 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5; );
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 1 #AND# b #LE# 1 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5; );
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 1 #AND# b #LE# 1 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5; );
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 1 #AND# b #LE# 1 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5; );

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 1 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 1 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 1 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 1 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);															

							! r = 5;
								
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 2 #AND# b #LE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 2 #AND# b #LE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 2 #AND# b #LE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 2 #AND# b #LE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 1 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 2 #AND# b #GT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 2 #AND# b #GT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 2 #AND# b #GT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 2 #AND# b #GT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	

							! r = 6;
								
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 3 #AND# b #LE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 3 #AND# b #LE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 3 #AND# b #LE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 3 #AND# b #LE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 3 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 3 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 3 #AND# b #GT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 3 #AND# b #GT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 3 #AND# b #GT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 3 #AND# b #GT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	


							! r = 7;
								
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 4 #AND# b #LE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 4 #AND# b #LE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 4 #AND# b #LE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 4 #AND# b #LE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 4 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 4 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 4 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 4 #AND# b #GT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 4 #AND# b #GT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 4 #AND# b #GT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 4 #AND# b #GT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	


							! r = 8;
								
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 5 #AND# b #LE# 5 #AND# b #GE# 2 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 5 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 5 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 5 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 5 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 5 #AND# b #GT# 5 #AND# b #LT# 2 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	



							! r = 9;
					
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 6 #AND# b #LE# 6 #AND# b #GE# 3 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);


								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 6 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 6 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 6 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 6 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 6 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 6 #AND# b #GT# 6 #AND# b #LT# 3 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	



							! r = 10;
								
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 7 #AND# b #LE# 7 #AND# b #GE# 4 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 7 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 7 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 7 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 7 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 7 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 7 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 7 #AND# b #GT# 7 #AND# b #LT# 4 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	


							! r = 11;
								
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 8 #AND# b #LE# 8 #AND# b #GE# 5 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 8 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 8 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 8 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 8 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 8 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 8 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 8 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 8 #AND# b #GT# 8 #AND# b #LT# 5 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	


							! r = 12;

								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 9 #AND# b #GE# 6 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 9 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 9 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 9 #AND# b #GT# 1 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 9 #AND# b #LT# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 9 #AND# b #LT# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 9 #AND# b #LT# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 9 #AND# b #LT# 6 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 9 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 9 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 9 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	


							! r = 13;
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 10 #AND# b #GE# 7 #AND# b #LE# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 10 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 10 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 10 #AND# b #EQ# 9 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 0; E1Herd(a,t,rr,b) >= 5;);
								

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 10 #AND# b #LT# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 10 #AND# b #LT# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 10 #AND# b #LT# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 10 #AND# b #LT# 7 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 10 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);	


							! r = 14;
								
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 11 #AND# b #EQ# 8 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 11 #AND# b #EQ# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 11: E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 11 #AND# b #LT# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 11 #AND# b #LT# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 11 #AND# b #LT# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 11 #AND# b #LT# 8 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 11 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);

							! r = 15;
								
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 12 #AND# b #GE# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 12 #AND# b #GE# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 12 #AND# b #GE# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 12 #AND# b #GE# 9 : E2X(a,t,rr,b) <= 100;	E2Y(a,t,rr,b) <= 20; E2Herd(a,t,rr,b) >= 5;);

								@for(links17(a,t,rr,b) | a #EQ# 1 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 3 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 4 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 5 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 6 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 7 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 8 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 9 #AND# rr #EQ# 12 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 10 #AND# rr #EQ# 12: E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 11 #AND# rr #EQ# 12: E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 12 #AND# rr #EQ# 12 #AND# b #LT# 9 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 13 #AND# rr #EQ# 12 #AND# b #LT# 9 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 14 #AND# rr #EQ# 12 #AND# b #LT# 9 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);
								@for(links17(a,t,rr,b) | a #EQ# 15 #AND# rr #EQ# 12 #AND# b #LT# 9 : E2X(a,t,rr,b) <= 0;	E2Y(a,t,rr,b) <= 0; 	E2Herd(a,t,rr,b) <= 0;);




		! change status from cattle with second pregnant to last pregnant ;
			
								@for(age6(ab) | ab #EQ# 4 : @for(age7(a) | a #EQ# 1  : @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 4: @for(milkingE2(rr) | rr #EQ# 1:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b);))))));
								@for(age6(ab) | ab #EQ# 5 : @for(age7(a) | a #EQ# 2: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 5 : @for(milkingE2(rr) | rr #EQ# 2:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 6 : @for(age7(a) | a #EQ# 3: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 6: @for(milkingE2(rr) | rr #EQ# 3:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 7 : @for(age7(a) | a #EQ# 4: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 7: @for(milkingE2(rr) | rr #EQ# 4:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
		

								@for(age6(ab) | ab #EQ# 5 : @for(age7(a) | a #EQ# 2: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 4: @for(milkingE2(rr) | rr #EQ# 1:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 6 : @for(age7(a) | a #EQ# 3: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 5 : @for(milkingE2(rr) | rr #EQ# 2:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 7 : @for(age7(a) | a #EQ# 4: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 6: @for(milkingE2(rr) | rr #EQ# 3:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 8 : @for(age7(a) | a #EQ# 5: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 7: @for(milkingE2(rr) | rr #EQ# 4:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));

								@for(age6(ab) | ab #EQ# 6 : @for(age7(a) | a #EQ# 3: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 4: @for(milkingE2(rr) | rr #EQ# 1:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 7 : @for(age7(a) | a #EQ# 4: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 5 : @for(milkingE2(rr) | rr #EQ# 2:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 8 : @for(age7(a) | a #EQ# 5: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 6: @for(milkingE2(rr) | rr #EQ# 3:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 9 : @for(age7(a) | a #EQ# 6: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 7: @for(milkingE2(rr) | rr #EQ# 4:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));

								@for(age6(ab) | ab #EQ# 7 : @for(age7(a) | a #EQ# 4  : @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 4: @for(milkingE2(rr) | rr #EQ# 1:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 8 : @for(age7(a) | a #EQ# 5: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 5 : @for(milkingE2(rr) | rr #EQ# 2:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 9 : @for(age7(a) | a #EQ# 6: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 6: @for(milkingE2(rr) | rr #EQ# 3:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));
								@for(age6(ab) | ab #EQ# 10 : @for(age7(a) | a #EQ# 7: @for(gestation(b) | b #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking2(r) | r #EQ# 7: @for(milkingE2(rr) | rr #EQ# 4:
									E2Herd(a,t,rr,b) = DE2(ab,t,r) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))))));

		! initial change structure;		@for(age7(a) | a #GE# 2: @for(time(t) | t #EQ# 1 : @for(gestation(b) | b #GE# 2: @for(milkingE2(rr) | rr #GE# 2 :
									E2Herd(a,t,rr,b) = E2Herd0(a-1,rr-1,b-1) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b)))));
								@for(links17(a,t,rr,b) | a #GE# 2 #AND# t #GE# 2 #AND# b #GE# 2 #AND# rr #GE# 2:
									E2Herd(a,t,rr,b) = E2Herd(a-1,t-1,rr-1,b-1) + E2X(a,t,rr,b) - E2Y(a,t,rr,b) - E2Abt(a,t,rr,b));

! Calf 0 months;						@for(time(t) : @for(gestation(b) | b #EQ# 9 : AM2(t) = @SUM(milkingE2(rr) | rr #GE# 8 : @SUM(age7(a) | a #GE# 9 : FR*E2Herd(a,t,rr,b)))));
								@for(gestation(b) | b #EQ# 9: AM20 = @SUM(milkingE2(rr) | rr #GE# 8 : @SUM(age7(a) | a #GE# 9 : FR*E2Herd0(a,rr,b))));								
								

		! Change status;				@for(age7(a) | a #GE# 9 : @for(gestation(b) | b #EQ# 9: @for(time(t) :
									(@SUM(milkingE2(rr) | rr #GE# 7: E2Herd(a,t,rr,b))) =  ED2(a,t))));
								@for(age7(a) | a #GE# 9 : @for(gestation(b) | b #EQ# 9:
									(@SUM(milkingE2(rr) | rr #GE# 7: E2Herd0(a,rr,b))) = ED20(a)));

		! ABortion;					@for(age7(a) : @for(gestation(b) : @for(milkingE2(rr): @for(time(t):
									E2Abt(a,t,rr,b) = BAR*E2Herd(a,t,rr,b)))));

		! Sell because Abortion;		@for(age7(a) : @for(milkingE2(rr) | rr #GE# 7: @for(time(t):
									@SUM(gestation(b): E2Abt(a,t,rr,b)) = E2AbSell(a,t,rr))));

		! Boundaries;				@for(time(t) : @SUM(age7(a): @SUM(milkingE2(rr): @SUM(gestation(b) | b #LT# 9: E2Herd(a,t,rr,b)))) <= 1000);


! Last Lactation;
	
								@for(links20(ab,t,r)  | ab #EQ# 1 #AND# r #LE# 1 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 2 #AND# r #LE# 2 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 3 #AND# r #lE# 3 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 4 #AND# r #LE# 4 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 5 #AND# r #LE# 5 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 6 #AND# r #LE# 6 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 7 #AND# r #LE# 7 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 8 #AND# r #LE# 8 #AND# r #GE# 2 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 10;);
								@for(links20(ab,t,r)  | ab #EQ# 9 #AND# r #LE# 9 #AND# r #GE# 3 : D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 10;);
								@for(links20(ab,t,r)  | ab #EQ# 10 #AND# r #GE# 4:D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 11 #AND# r #GE# 5: D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 12 #AND# r #GE# 6: D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 13 #AND# r #GE# 7: D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 14 #AND# r #GE# 8: D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 15 #AND# r #GE# 9: D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								@for(links20(ab,t,r)  | ab #EQ# 16 #AND# r #GE# 10: D3Y(ab,t,r) <= 20; D3X(ab,t,r) <= 100; D3Herd(ab,t,r) >= 5;);
								
								@for(links20(ab,t,r)  | ab #EQ# 1 #AND# r #GT# 1 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 2 #AND# r #GT# 2 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 3 #AND# r #GT# 3 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 4 #AND# r #GT# 4 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 5 #AND# r #GT# 5 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 6 #AND# r #GT# 6 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 7 #AND# r #GT# 7 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 8 #AND# r #LT# 2 #AND# r #GT# 8 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 9 #AND# r #LT# 3 #AND# r #GT# 9 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 10 #AND# r #LT# 4 #AND# r #GT# 7:D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 11 #AND# r #LT# 5: D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 12 #AND# r #LT# 6: D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 13 #AND# r #LT# 7: D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 14 #AND# r #LT# 8: D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 15 #AND# r #LT# 9 : D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );
								@for(links20(ab,t,r)  | ab #EQ# 16 #AND# r #LT# 10: D3Y(ab,t,r) <= 0; D3X(ab,t,r) <= 0;	D3HErd(ab,t,r) <= 0; );



			! change status from initial;	
	
								@for(age7(a) | a #EQ# 9 : @for(age8(ab) | ab #EQ# 1 : @for(milking3(r) | r #EQ# 1:
									ED20(a) + D3Herd0(ab,r) = D3Herd0Total(ab,r))));
								@for(age7(a) | a #EQ# 10 : @for(age8(ab) | ab #EQ# 2 : @for(milking3(r) | r #EQ# 1: 
									ED20(a) + D3Herd0(ab,r) = D3Herd0Total(ab,r))));
								@for(age7(a) | a #EQ# 11 : @for(age8(ab) | ab #EQ# 3 : @for(milking3(r) | r #EQ# 1: 
									ED20(a) + D3Herd0(ab,r) = D3Herd0Total(ab,r))));
								@for(age7(a) | a #EQ# 12 : @for(age8(ab) | ab #EQ# 4 : @for(milking3(r) | r #EQ# 1:
									ED20(a) + D3Herd0(ab,r) = D3Herd0Total(ab,r))));
								@for(age7(a) | a #EQ# 13 : @for(age8(ab) | ab #EQ# 5 : @for(milking3(r) | r #EQ# 1: 
									ED20(a) + D3Herd0(ab,r) = D3Herd0Total(ab,r))));
								@for(age7(a) | a #EQ# 14 : @for(age8(ab) | ab #EQ# 6 : @for(milking3(r) | r #EQ# 1: 
									ED20(a) + D3Herd0(ab,r) = D3Herd0Total(ab,r))));
								@for(age7(a) | a #EQ# 15 : @for(age8(ab) | ab #EQ# 7 : @for(milking3(r) | r #EQ# 1: 
									ED20(a) + D3Herd0(ab,r) = D3Herd0Total(ab,r))));

			! change status from E;		@for(age7(a) | a #EQ# 9 : @for(age8(ab) | ab #EQ# 1 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : 
									D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));
								@for(age7(a) | a #EQ# 10 : @for(age8(ab) | ab #EQ# 2 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : 
									D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));
								@for(age7(a) | a #EQ# 11 : @for(age8(ab) | ab #EQ# 3 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : 
									D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));
								@for(age7(a) | a #EQ# 12 : @for(age8(ab) | ab #EQ# 4 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : 
									D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));
								@for(age7(a) | a #EQ# 13 : @for(age8(ab) | ab #EQ# 5 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : 
									D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));
								@for(age7(a) | a #EQ# 14 : @for(age8(ab) | ab #EQ# 6 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : 
									D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));
								@for(age7(a) | a #EQ# 15 : @for(age8(ab) | ab #EQ# 7 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : 
									D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));
								


	! Herd structure balance;	
								
			! Initial;				@for(age8(ab) | ab #GE# 2 #AND# ab #LE# 6 : @for(time(t) | t #EQ# 1 : @for(milking3(r) | r #EQ# 2 : 
									D3Herd(ab,t,r) = D3Herd0Total(ab-1,r-1) + D3X(ab,t,r) - D3Y(ab,t,r))));
								@for(age8(ab) | ab #GE# 7 : @for(time(t) | t #EQ# 1 : @for(milking3(r) | r #GE# 2:
									D3Herd(ab,t,r) = D3Herd0(ab-1,r-1) + D3X(ab,t,r) - D3Y(ab,t,r))));
								@for(age8(ab) | ab #GE# 2 #AND# ab #LE# 6 : @for(time(t) | t #EQ# 1 : @for(milking3(r) | r #GE# 3:
									D3Herd(ab,t,r) = D3Herd0(ab-1,r-1) + D3X(ab,t,r) - D3Y(ab,t,r))));

								@for(age8(ab) | ab #GE# 2 : @for(time(t) | t #GE# 2 : @for(milking3(r) | r #GE#2 :
									D3Herd(ab,t,r) = D3Herd(ab-1,t-1,r-1) + D3X(ab,t,r) - D3Y(ab,t,r))));

		! sell all;					@for(links10(ab,t,r) | r #EQ# 10 : D3Herd(ab,t,r) = D3Y(ab,t,r));

		! Boundaries;				@for(time(t) : @SUM(age8(ab): @SUM(milking2(r) : D3Herd(ab,t,r))) <= 1000);









! Herd Constraints;
		! quantities of cattle in herd;			@for(time(t): Herd(t) = @SUM(age1(a): AHerd(a,t)) + @SUM(age2(a): BHerd(a,t)) + 
												@SUM(age3(a): @SUM(gestation(b) | b #LT# 9: CHerd(a,t,b))) +
												@SUM(age4(ab): @SUM(milking(r) : D1Herd(ab,t,r))) +
												@SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: E1Herd(a,t,rr,b)))) +
												@SUM(age6(ab) : @SUM(milking2(r) : D2Herd(ab,t,r))) +
												@SUM(age7(a): @SUM(milkingE2(rr) : @SUM(gestation(b) | b #LT# 9: E2Herd(a,t,rr,b)))) +
												@SUM(age8(ab) : @SUM(milking3(r) : D3Herd(ab,t,r))));

		! quantities of cattle in herd;	@for(time(t) : Cattle(t) = 	@SUM(age4(ab): @SUM(milking(r) : D1Herd(ab,t,r))) +
													@SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: E1Herd(a,t,rr,b)))) +
													@SUM(age6(ab) : @SUM(milking2(r) : D2Herd(ab,t,r))) +
													@SUM(age7(a): @SUM(milkingE2(rr) : @SUM(gestation(b) | b #LT# 9: E2Herd(a,t,rr,b)))) +
													@SUM(age8(ab) : @SUM(milking3(r) : D3Herd(ab,t,r))));

		! capacity of farmer;			@for(time(t) : Herd(t) <= 8000);
								@for(time(t) : Herd(t) >= 2000);

								

								@for(time(t) :		(@SUM(age1(a): AY(a,t)) + @SUM(age2(a): BY(a,t)) + 
												@SUM(age3(a): @SUM(gestation(b) | b #LT# 9: CY(a,t,b))) +
												@SUM(age4(ab): @SUM(milking(r) : D1Y(ab,t,r))) +
												@SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: E1Y(a,t,rr,b)))) +
												@SUM(age6(ab) : @SUM(milking2(r) : D2Y(ab,t,r))) +
												@SUM(age7(a): @SUM(milkingE2(rr) : @SUM(gestation(b) | b #LT# 9: E2Y(a,t,rr,b)))) +
												@SUM(age8(ab) : @SUM(milking3(r) : D3Y(ab,t,r)))) <= 0.25*Herd(t));

! quatities of rawmilk;					@for(time(t) : Milk(t) =
	
											@SUM(age4(ab): @SUM(milking(r) : MRD1(r)*D1Herd(ab,t,r))) +
											@SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: MRE1(rr)*E1Herd(a,t,rr,b)))) +
											@SUM(age5(a): @SUM(milkingE(rr) | rr #LE# 7: @SUM(gestation(b) | b #LE# 9: MRE2(rr)*E1Abt(a,t,rr,b))))+
											@SUM(age6(ab) : @SUM(milking2(r) : MRD2(r)*D2Herd(ab,t,r))) +
											@SUM(age7(a): @SUM(milkingE2(rr) : @SUM(gestation(b) | b #LT# 9: MRE2(rr)*E2Herd(a,t,rr,b)))) +
											@SUM(age7(a): @SUM(milkingE2(rr) | rr #LE# 7: @SUM(gestation(b) | b #LE# 9: MRE2(rr)*E2Abt(a,t,rr,b)))) +
											@SUM(age8(ab) : @SUM(milking3(r) : MRD3(r)*D3Herd(ab,t,r))));

								@for(time(t):

									Atotal(t) = @SUM(age1(a): AHerd(a,t));
									Btotal(t) = @SUM(age2(a): BHerd(a,t));
									Ctotal(t) = @SUM(age3(a): @SUM(gestation(b) | b #LT# 9: CHerd(a,t,b)));
									D1total(t) = @SUM(age4(ab): @SUM(milking(r) : D1Herd(ab,t,r)));
									E1total(t) = @SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: E1Herd(a,t,rr,b))));
									D2total(t) = @SUM(age6(ab) : @SUM(milking2(r) : D2Herd(ab,t,r)));
									E2total(t) = @SUM(age7(a): @SUM(milkingE2(rr) : @SUM(gestation(b) | b #LT# 9: E2Herd(a,t,rr,b))));
									D3total(t) = @SUM(age8(ab) : @SUM(milking3(r) : D3Herd(ab,t,r)));
								);

! produce do not exceed factory's capacity;
	@FOR(time(t):
	@SUM(product(i): Y(t,i)) <= Cap);	
	
	! min demand <= product <= max demand;
	@FOR(LINKS1(t,i): Y(t,i) = MinD(t,i));
	!@FOR(LINKS1(t,i): Y(t,i) <= MaxD(t,i));

	! Raw milk (product) = Demand;
	@FOR(LINKS3(t,c):W(t,c) = RD(t,c));

	! Milk(Box) = Demand;
	@FOR(time(t):
	@SUM(outsource(k):V(t,k)) = BoxD(t));

	! Milk(Box) in = Rawmilk outsource;

	@FOR(outsource(k): @SUM(time(t) | t #LE# 12 :BV*V(t,k))= @SUM(time(t) | t #LE# 12 :Z(t,k)));
	@FOR(outsource(k): @SUM(time(t) | t #LE# 24 #AND# t #GE# 13 :BV*V(t,k))= @SUM(time(t) | t #LE# 24 #AND# t #GE# 13 :Z(t,k)));
	@FOR(outsource(k): @SUM(time(t) | t #LE# 36 #AND# t #GE# 25 :BV*V(t,k))= @SUM(time(t) | t #LE# 36 #AND# t #GE# 25 :Z(t,k)));

	!@for(outsource(k): @for(time(t) | t #EQ# 3: (BV*V(t,k)) = SB3));
	!@for(outsource(k): SB3 = @SUM(time(t) | t #LE# 4: Z(t,k))); 
	
	!@for(outsource(k): @for(time(t) | t #EQ# 15: (BV*V(t,k)) = SB15));
	!@for(outsource(k): SB3 = @SUM(time(t) | t #LE# 4: Z(t,k)));

	!@for(outsource(k): @for(time(t) | t #EQ# 27: (BV*V(t,k)) = SB27));
	!@for(outsource(k): SB3 = @SUM(time(t) | t #LE# 4: Z(t,k)));

	!@for(outsource(k): @for(time(t) | t #EQ# 10: (BV*V(t,k)) = SB10));
	!@for(outsource(k): SB3 = @SUM(time(t) | t #LE# 10 #AND# t #GE# 9: Z(t,k)));

	!@for(outsource(k): @for(time(t) | t #EQ# 22: (BV*V(t,k)) = SB22));
	!@for(outsource(k): SB3 = @SUM(time(t) | t #LE# 22 #AND# t #GE# 21 : Z(t,k)));	

	!@for(outsource(k): @for(time(t) | t #EQ# 32: (BV*V(t,k)) = SB32));
	!@for(outsource(k): SB3 = @SUM(time(t) | t #LE# 32 #AND# t #GE# 31: Z(t,k)));

	! In = out (Raw milk volume);
	@FOR(time(t): @SUM(rawmat(j):H(t,j)) = @SUM(product(i):PV(i)*Y(t,i))+@SUM(customer(c):W(t,c))+@SUM(outsource(k):Z(t,k) + @SUM(time(t): Sale(t))));

	@FOR(time(t): @for(outsource(j) | j #EQ# 1: H(t,j) >= 100000));
	@FOR(time(t): @for(outsource(j) | j #EQ# 1: H(t,j) <= 2300000));

	@FOR(time(t): @for(outsource(k) : Z(t,k) <= OCap));
	@FOR(time(t): @for(outsource(k) : V(t,k) <= BoxCap));

	@FOR(time(t): @FOR(rawmat(j) | j #EQ# 2 : H(t,j) >= 100*1000));
	@FOR(time(t): @FOR(rawmat(j) | j #EQ# 3 : H(t,j) >= 80*1000));
	@FOR(time(t): @FOR(rawmat(j) | j #EQ# 4 : H(t,j) >= 10*1000));

	@FOR(time(t): @FOR(rawmat(j) | j #EQ# 2 : H(t,j) <= 140*1000));
	@FOR(time(t): @FOR(rawmat(j) | j #EQ# 3 : H(t,j) <= 120*1000));
	@FOR(time(t): @FOR(rawmat(j) | j #EQ# 4 : H(t,j) <= 40*1000));

	@for(time(t): @for(rawmat(j) | j #EQ# 1 : Milk(t) = H(t,j)));


`.toLowerCase();




const readLine = (input) => {

    const lines = [];

    let isComment = false;
    let memory = '';

    let openBracket = 0;
    let closeBracket = 0;

    for (let i = 0 ; i < input.length ; ++i) {
        if (input[i] == '!') {
            isComment = true;
        }

        if (input[i] == ';' && isComment) {
            isComment = false;
            continue;
        }

        if (isComment) {
            continue
        }

        if (input[i] == '(') {
            openBracket++;
        }

        if (input[i] == ')') {
            closeBracket++;
        }

        if (input[i] == ';' && !isComment && openBracket == closeBracket) {
            memory += input[i];
            lines.push(memory.trim().replace(/\t/g, '').replace(/\n/g, ''));
            memory = '';
            openBracket = 0;
            closeBracket = 0;
        } else {
            memory += input[i];
        }
    }

    return lines;
}

const lingoToPy = (lingo) => {

    function reverse(s){
        return s.split("").reverse().join("");
    }

	let constantList = [
		'pv'
	]

    let setList = [
        'customer',
        'product',
        'rawmat',
        'outsource',
        'time',
        'age1',
        'age2',
        'age3',
        'age4',
        'age5',
        'age6',
        'age7',
        'age8',
        'milking',
        'milking2',
        'milking3',
        'milkinge',
        'milkinge2',
        'gestation',
    ];
    
    let derivedSet = {
        'links1': ['time', 'product'],
        'links2': ['time', 'rawmat'],
        'links3': ['time', 'customer'],
        'links4': ['time', 'outsource'],
        'links5': ['age1', 'time'],
        'links6': ['age2', 'time'],
        'links7': ['age3', 'time', 'gestation'],
        'links8': ['age4', 'time', 'milking'],
        'links9': ['age5', 'time', 'milkinge', 'gestation'],
        'links10': ['age6', 'time', 'milking2'],
        'links11': ['age3', 'gestation'],
        'links12': ['age3', 'time'],
        'links13': ['age4', 'milking'],
        'links14': ['age5', 'milkinge', 'gestation'],
        'links15': ['age6', 'milking2'],
        'links16': ['age5', 'time'],
        'links17': ['age7', 'time', 'milkinge', 'gestation'],
        'links18': ['age7', 'milkinge', 'gestation'],
        'links19': ['age7', 'time'],
        'links20': ['age8', 'time', 'milking2'],
        'links21': ['age8', 'milking2'],
        'links23': ['age5', 'time', 'milkinge'],
        'links24': ['age7', 'time', 'milkinge2'],
    }
    
    let variableMapping = {}
    
    const debugMode = false;
    
    const logger = (string) => (debugMode) ? console.log(string) : null; 
    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    const isInList = (input) => {
        logger('SEARCHING ' + input);
        for (let i = 0 ; i < setList.length ; ++i) {
    
            if (input == setList[i]) {
                logger('FOUND !');
                return true;
            }
        }
    
        return false;
    }

	const isConstant = (input) => {
        for (let i = 0 ; i < constantList.length ; ++i) {
    
            if (input == constantList[i]) {
                return true;
            }
        }
    
        return false; 
	}
    
    const isDerived = (input) => {
        return derivedSet[input] != null;
    }
    
    function isNumber(val){
        return !isNaN(val)
    }
    
    const conditionToPy = (condition) => {
    
        condition = condition.trim();
    
        condition = condition.replace(/#eq#/g, '==');
        condition = condition.replace(/#ge#/g, '>=');
        condition = condition.replace(/#le#/g, '<=');
        condition = condition.replace(/#gt#/g, '>');
        condition = condition.replace(/#lt#/g, '<');
        condition = condition.replace(/#and#/g, 'and');
        condition = condition.replace(/#or#/g, 'or');
    
        let valueMemory = '';
        let startValue = false;
        let startPosition = 0;
        let endPosition = 0;
    
        let variableName = '';
    
        for (let i = 0 ; i < condition.length ; ++i) {
    
            if (
                condition[i] == '=' ||
                condition[i] == '>' ||
                condition[i] == '<'
            ) {
                if (condition[i + 1] == '=') {
                    continue;
                }
                startPosition = i;
                startValue = true;
    
                // find variable name
                let startReadName = false;
                for (let m = i ; m >= 0 ; --m) {
                    if (m == 0) {
                        variableName += condition[m];
                        break;
                    }
                    if (condition[m] == ' ') {
                        if (startReadName) {
                            startReadName = false;
                            break;
                        } else {
                            startReadName = true;
                            continue;
                        }
                    }
    
                    if (startReadName) {
                        variableName += condition[m];
                    }
                }
                // find variable name 
                continue;
            }
    
            if (condition[i] == ' ') {
                continue;
            }
    
            if (!isNumber(condition[i]) && startValue || i == condition.length - 1) {
    
                if (i == condition.length - 1) {
                    valueMemory += condition[i];
                }
                endPosition = i;
                if (i == condition.length - 1) {
                    condition = condition.substring(0, startPosition + 1).trim() + ` at(${valueMemory}, ${variableMapping[reverse(variableName.trim())]}_range)`;
                    break
                } else {
                    condition = condition.substring(0, startPosition + 1).trim() + ` at(${valueMemory}, ${variableMapping[reverse(variableName.trim())]}_range) ` + condition.substring(endPosition, condition.length);
                }
                variableName = '';
                startValue = false;
                valueMemory = '';
            }
    
            if (startValue) {
                valueMemory += condition[i];
            }
        }
    
        return condition;
    }
    
    let output = '';
    let sumOutput = '';
    let outputSumIndex = 0;
    let rawOutput = '';
    let rawSumOutput = '';
    let operator = '';
    let sumOperator = '';
    
    let sumList = [];
    
    let lastSetName = '';
    
    const genTab = (tabSize) => {
        for (let i = 0 ; i < tabSize ; ++i) {
            output += '\t';
        }
    }
    
    const process = (input, tabSize) => {
    
        let memory = '';
        let setMemory = '';
        let command = '';
        let condition = '';
    
        for (let i = 0 ; i < input.length ; ++i) {
            
            // empty string zone
            if (input[i] == ' ')
                continue;
    
            if (input[i] == '|') {
                for (k = i + 1 ; k < input.length ; ++k) {
                    if (input[k] == ':')
                        break
    
                    condition += input[k];
                }
                logger('CONDITION ' + condition);
            }
    
            // command zone
            if (input[i] == '(') {
                if (memory == '@for') {
                    command = 'for';
                    memory = '';
                    continue
                } 
                
                if (isInList(memory) || isDerived(memory)) {
                    setMemory = memory;
                    memory = '';
                    continue
                }
    
                
            }
    
            // end zone
            if (input[i] == ')') {
                if (setMemory != '') {
                    if (isDerived(setMemory)) {
                        for (let count = 0 ; count < derivedSet[setMemory].length ; ++count) {
                            tabSize = tabSize + count;
                            genTab(tabSize);
                            output += `for ${memory.split(',')[count]} in ${derivedSet[setMemory][count]}_range:\n`
                            variableMapping[memory.split(',')[count].trim()] = derivedSet[setMemory][count].trim();
                        }
                    } else {
                        genTab(tabSize);
                        output += `for ${memory} in ${setMemory}_range:\n`
                        variableMapping[memory.trim()] = setMemory.trim();
                    }
                    lastSetName = setMemory;
                    setMemory = ''
                    memory = '';
                    continue
                } 
                
            }
    
            // next zone :
            if (input[i] == ':') {
    
                if (condition != '') {
                    genTab(++tabSize);
                    output += `if (${conditionToPy(condition).trim()}):\n`
                    lastSetName = '';
                    // TODO: add processCondition here
                }
    
                let openBracket = 1
                let closeBracket = 0
                let slicedString = '';
                let finishPoint = -1;
                for (let j = i + 1; j < input.length ; ++j) {
                    if (input[j] == '(') {
                        openBracket++;
                    } else if (input[j] == ')') {
                        closeBracket++;
                        if (openBracket == closeBracket) {
                            if (slicedString.includes('@for')) {
                                process(slicedString, tabSize + 1);
                            } else {
                                processString(slicedString, tabSize + 1);
                                const splitedRawOutput = rawOutput.split('\n');
    
                                for (let t = 0 ; t < splitedRawOutput.length - 1 ; ++t) {
                                    genTab(tabSize + 1);
                                    for (let m = 0 ; m < sumList.length ; ++m) {
                                        splitedRawOutput[t] = splitedRawOutput[t].trim().replace('$$' + m, 'lpSum(tmp_' + sumList[m] + ')')
                                    }
                                    output += `model += ${splitedRawOutput[t].trim()}\n`
                                }
    
                            }
                            finishPoint = j
                            break
                        }
                    }
                    slicedString += input[j];
                } 
                if (finishPoint != -1) {
                    i = finishPoint
                    memory = '';
                    setMemory = '';
                    command = '';
                    condition = '';
                    continue
                }
            }
            
            memory += input[i];
        }
    }
    
    const processString = (input, tabSize) => {
        logger('THESE ARE COMMON STRING');
        logger(input.trim());
    
        // find sum
    
        let sumMemory = '';
        let startGetSum = false;
        let startPosition = -1;
        let endPosition = -1;
        for (let i = 0 ; i < input.length ; ++i) {
            if (input[i] == '@') {
                startGetSum = true;
                startPosition = i;
            }
    
            if (input[i] == '(') {
                if (sumMemory.trim() == '@sum') {
                    sumMemory += input[i]; // add (
                    openBracket = 1;
                    closeBracket = 0;
                    for (let k = i + 1; k < input.length ; ++k) {
    
                        sumMemory += input[k];
    
                        if (input[k] == '(') 
                            openBracket++;
                        
                        if (input[k] == ')')
                            closeBracket++;
    
                        if (openBracket == closeBracket) {
                            endPosition = k;
                            genTab(tabSize);
                            const randomNumber = Math.floor(Math.random() * 10000) + 100;
                            sumList.push(randomNumber);
                            output += 'tmp_' + randomNumber + ' = []\n';
                            processSumString(sumMemory, tabSize, randomNumber);
                            logger('PROCESS SUM ' + sumMemory);
                            sumMemory = '';
    
                            logger('SLICED STRING is ' + input.slice(startPosition, endPosition));
                            input = input.replace(input.slice(startPosition, endPosition + 1), '$$$' + outputSumIndex++);
                            logger(input);
                            
                            break;
                        }
                    }
                }
                startGetSum = false;
            }
    
            if (startGetSum) {
                sumMemory += input[i];
            }
        }
        // end find sum
    
        let memory = '';
    
        let ignoreOperator = false;
    
        for (let i = 0 ; i < input.length ; ++i) {
            // empty string zone
            if (input[i] == ' ')
                continue;
    
            if (input[i] == '(') {
                ignoreOperator = true;
            }
            
            if (input[i] == ')') {
                ignoreOperator = false;
            }
    
            if (!ignoreOperator) {
                if (input[i] == '>' || input[i] == '<') {
                    if (input[i+1] == '=') {
                        operator = input[i] + input[i+1];
                        i++;
                    } else {
                        operator = input[i];
                    }
    
                    // process raw output
                    convertVariableToInfo(memory);
                    memory = '';
                    continue;
                }
    
                if (input[i] == '+' || input[i] == '-' || input[i] == '*' || input[i] == '/' || input[i] == '=') {
                    operator = input[i] == '=' ? '==' : input[i]
                    convertVariableToInfo(memory);
                    memory = '';
                    continue;
                }
            }
    
            memory += input[i];
    
            if (i == input.length - 1 || input[i] == ';') {
                operator = ''
                convertVariableToInfo(memory);
                memory = '';
                logger('CHUNK ' + input.slice(i+1, input.length));
                rawOutput += '\n';
                processString(input.slice(i+1, input.length), tabSize);
                break;
            }
        }
    
    
        // genTab(tabSize)
        // output += input.trim();
    }
    
    const convertVariableToInfo = (memory) => {
        if (memory.includes('(') || memory.includes(')')) {
            let variableName = '';
            let variableScope = '';
            let subMemory = '';
            for (let k = 0 ; k < memory.length ; ++k) {
                if (memory[k] == ' ')
                    continue;
    
                if (memory[k] == '(') {
                    variableName = subMemory;
                    subMemory = '';
                    continue;
                }
    
                if (memory[k] == ')') {
                    variableScope = subMemory;
                    break;
                }
    
                subMemory += memory[k];
            }
    
            logger(`variableName=${variableName} variableScope=${variableScope}`);
            rawOutput += `d[kk('${variableName.trim()}',${variableScope})] ${operator} `
        } else {
            // constant
            // rawOutput += memory.trim() + ' ' + operator + ' ';
            logger('constant=' + memory.trim());
            memory = memory.replace(';', '');
            rawOutput += `${isNumber(memory.trim()) ? `${memory.trim()}` : ((memory.trim().includes('$$') || isConstant(memory.trim())) ? memory.trim() : `d['${memory.trim()}']`)} ${operator} `
        }
    }
    
    const sumConvertVariableToInfo = (memory) => {
        if (memory.includes('(') || memory.includes(')')) {
            let variableName = '';
            let variableScope = '';
            let subMemory = '';
            for (let k = 0 ; k < memory.length ; ++k) {
                if (memory[k] == ' ')
                    continue;
    
                if (memory[k] == '(') {
                    variableName = subMemory;
                    subMemory = '';
                    continue;
                }
    
                if (memory[k] == ')') {
                    variableScope = subMemory;
                    break;
                }
    
                subMemory += memory[k];
            }
    
            logger(`variableName=${variableName} variableScope=${variableScope}`);
            rawSumOutput += `d[kk('${variableName.trim()}',${variableScope})] ${sumOperator} `
        } else {
            // constant
            // rawOutput += memory.trim() + ' ' + operator + ' ';
            logger('constant=' + memory.trim());
            memory = memory.replace(';', '');
            rawSumOutput += `${isNumber(memory.trim()) ? `${memory.trim()}` : ((memory.trim().includes('$$') || isConstant(memory.trim())) ? memory.trim() : `d['${memory.trim()}']`)} ${sumOperator} `
        }
    }
    
    const processSumString = (input, tabSize, randomNumber) => {
        let memory = '';
        let setMemory = '';
        let command = '';
        let condition = '';
    
        for (let i = 0 ; i < input.length ; ++i) {
            
            // empty string zone
            if (input[i] == ' ')
                continue;
    
            if (input[i] == '|') {
                for (k = i + 1 ; k < input.length ; ++k) {
                    if (input[k] == ':')
                        break
    
                    condition += input[k];
                }
                logger('CONDITION ' + condition);
            }
    
            // command zone
            if (input[i] == '(') {
                if (memory == '@sum') {
                    command = 'sum';
                    memory = '';
                    continue
                } 
                
                if (isInList(memory) || isDerived(memory)) {
                    setMemory = memory;
                    memory = '';
                    continue
                }
    
                
            }
    
            // end zone
            if (input[i] == ')') {
                if (setMemory != '') {
                    if (isDerived(setMemory)) {
                        for (let count = 0 ; count < derivedSet[setMemory].length ; ++count) {
                            tabSize = tabSize + count;
                            genTab(tabSize);
                            output += `for ${memory.split(',')[count]} in ${derivedSet[setMemory][count]}_range:\n`
                            variableMapping[memory.split(',')[count].trim()] = derivedSet[setMemory][count].trim();
                        }
                    } else {
                        genTab(tabSize);
                        output += `for ${memory} in ${setMemory}_range:\n`
                        variableMapping[memory.trim()] = setMemory.trim();
                    }
                    lastSetName = setMemory;
                    setMemory = ''
                    memory = '';
                    continue
                } 
                
            }
    
            // next zone :
            if (input[i] == ':') {
    
                if (condition != '') {
                    genTab(++tabSize);
                    output += `if (${conditionToPy(condition)}):\n`;
                    lastSetName = '';
                    // TODO: add processCondition here
                }
    
                let openBracket = 1
                let closeBracket = 0
                let slicedString = '';
                let finishPoint = -1;
                for (let j = i + 1; j < input.length ; ++j) {
                    if (input[j] == '(') {
                        openBracket++;
                    } else if (input[j] == ')') {
                        closeBracket++;
                        if (openBracket == closeBracket) {
                            if (slicedString.includes('@sum')) {
                                processSumString(slicedString, tabSize + 1, randomNumber);
                            } else {
                                logger('CONSTANT SECTION');
                                genTab(tabSize + 1);
                                output += `tmp_${randomNumber}.append(${processSumNormalString(slicedString).trim()})` + '\n'
                                rawSumOutput = '';
                            }
                            finishPoint = j
                            break
                        }
                    }
                    slicedString += input[j];
                } 
                if (finishPoint != -1) {
                    i = finishPoint
                    memory = '';
                    setMemory = '';
                    command = '';
                    condition = '';
                    continue
                }
            }
            
            memory += input[i];
        }
    }
    
    const processSumNormalString = (input) => {
    
        let memory = '';
    
        let ignoreOperator = false;
    
        for (let i = 0 ; i < input.length ; ++i) {
            // empty string zone
            if (input[i] == ' ')
                continue;
    
            if (input[i] == '(') {
                ignoreOperator = true;
            }
            
            if (input[i] == ')') {
                ignoreOperator = false;
            }
    
            if (!ignoreOperator) {
                if (input[i] == '>' || input[i] == '<') {
                    if (input[i+1] == '=') {
                        sumOperator = input[i] + input[i+1];
                        i++;
                    } else {
                        sumOperator = input[i];
                    }
    
                    // process raw output
                    sumConvertVariableToInfo(memory);
                    memory = '';
                    continue;
                }
    
                if (input[i] == '+' || input[i] == '-' || input[i] == '*' || input[i] == '/' || input[i] == '=') {
                    sumOperator = input[i] == '=' ? '==' : input[i]
                    sumConvertVariableToInfo(memory);
                    memory = '';
                    continue;
                }
            }
    
            memory += input[i];
    
            if (i == input.length - 1 || input[i] == ';') {
                sumOperator = ''
                sumConvertVariableToInfo(memory);
                memory = '';
                logger('CHUNK ' + input.slice(i+1, input.length));
                break;
            }
        }
    
        return rawSumOutput;
    }
    
    if (!lingo.includes('@for')) {
        processString(lingo, 0);
        const splitedRawOutput = rawOutput.split('\n');
    
        for (let t = 0 ; t < splitedRawOutput.length - 1 ; ++t) {
            for (let m = 0 ; m < sumList.length ; ++m) {
                splitedRawOutput[t] = splitedRawOutput[t].trim().replace('$$' + m, 'lpSum(tmp_' + sumList[m] + ')')
            }
            output += `model += ${splitedRawOutput[t].trim()}\n`
        }
    } else {
        process(lingo, 0);
    }
    
    return output;
}

// const resultLine = readLine(lingoCode);

// let fileResult = '';

// for (let l = 0 ; l < resultLine.length ; ++l) {
//     fileResult += `\n# ${resultLine[l]}\n${lingoToPy(resultLine[l])}\n`;
// }

// fs.writeFile('output.py', fileResult, function (err) {
//     if (err) return console.log(err);
//     console.log('Success');
// });

// console.log(lingoToPy('COST		= @SUM(LINKS2(t,j) : RC(t,j)*H(t,j))+@SUM(LINKS4(t,k):BC(t,k)*V(t,k))+@SUM(LINKS1(t,i):PC(i)*Y(t,i));'.toLowerCase()));

console.log(lingoToPy('@for(gestation(k): @sum(time(t): @sum(product(i): dherd1(t))));'.toLowerCase()))