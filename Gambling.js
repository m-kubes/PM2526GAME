const inRange = (value, min, max) => {
  return value >= min && value <= max;
}

// TODO: FIX CHANCES

const rollSlot = () => {
    const symbolID = Math.floor(Math.random() * 100) + 1;

    switch (true) {
        case inRange(symbolID, 1, 1): // 1
            return "SEVEN";
        case inRange(symbolID, 2, 5): // 3
            return "BAR";
        case inRange(symbolID, 6, 11): // 5
            return "CHERRY";
        case inRange(symbolID, 12, 24): // 12
            return "BELL";
        case inRange(symbolID, 25, 100): // 75 / 3 = 25 for each
            switch (Math.floor(Math.random() * 3) + 1) {
                case 1:
                    return "LEMON";
                case 2:
                    return "ORANGE";
                case 3:
                    return "GRAPE";
                default:
                    return null;
            }
    
        default:
            return null;
    }
}

const spinSlots = (numberOfRolls, betAmount) => {
    const SYMBOL_MULTIPLIERS = {
        "SEVEN": 50, "BAR": 20, "CHERRY": 10,
        "BELL": 5, "LEMON": 2, "ORANGE": 2, "GRAPE": 2
    };

    let slotRolls = Array.from({ length: numberOfRolls }, () => rollSlot());
    console.log("Rolls:", slotRolls);

    const counts = {};
    for (const symbol of slotRolls) {
        counts[symbol] = (counts[symbol] || 0) + 1;
    }
    
    let totalPayout = 0;

    for (const [symbol, count] of Object.entries(counts)) {
        const matchRatio = count / numberOfRolls;
        let matchPercentage = 0;

        if (matchRatio === 1) {
            matchPercentage = 1;    
        } else if (matchRatio >= 0.66) {
            matchPercentage = 0.5;
        }

        const baseMultiplier = SYMBOL_MULTIPLIERS[symbol];
        
        let reward = 0;
        switch (matchPercentage) {
            case 1:
                reward = betAmount * baseMultiplier;
                break;
            case 0.5:
                reward = betAmount / 2;
                break;
            case 0:
                reward = 0;
                break;
        }

        if (count > 1) {
            console.log(`Matched ${count}/${numberOfRolls} ${symbol}! Win: ${reward}`);
        }
        totalPayout += reward;
        
    }

    return totalPayout;
}

let jackpot = false;
let betAmount = 500;
let iterationCount = 1;

while (!jackpot) {
    iterationCount++;

    let spin = spinSlots(3, betAmount);

    console.log(spin);
    console.log(iterationCount);

    if (spin === betAmount * 50) {
        jackpot = true;
    };
}