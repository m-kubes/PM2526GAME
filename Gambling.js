const inRange = (value, min, max) => {
  return value >= min && value <= max;
}

// TODO: FIX CHANCES

const rollSlot = () => {
    const symbolID = Math.floor(Math.random() * 100) + 1;

    switch (true) {
        case inRange(symbolID, 1, 3): // 3
            return "SEVEN";
        case inRange(symbolID, 4, 10): // 6
            return "BAR";
        case inRange(symbolID, 11, 23): // 12
            return "CHERRY";
        case inRange(symbolID, 24, 49): // 25
            return "BELL";
        case inRange(symbolID, 50, 100): // 50
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

console.log(spinSlots(3, 10000000));