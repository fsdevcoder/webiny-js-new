const affectsDelimiter = "affects:";

export default (commits, pkg) => {
    return commits.filter(function(commit) {
        return isRelevant(findAffectsLine(commit), pkg.name);
    });
};

function isRelevant(affectsLine, packageName) {
    const affectedPackages = getAffectedPackages(affectsLine);
    return affectedPackages.some(function(thisPackage) {
        return thisPackage === packageName;
    });
}

function getAffectedPackages(affectsLine) {
    if (!affectsLine || affectsLine.indexOf(affectsDelimiter) !== 0) {
        return [];
    }
    const trimmedPackages = affectsLine.split(affectsDelimiter)[1].trim();
    if (trimmedPackages.length === 0) {
        return [];
    }
    return trimmedPackages
        .split(",")
        .map(p => p.trim())
        .filter(p => p.length);
}

function findAffectsLine(commit) {
    if (
        !commit ||
        !commit.message ||
        !commit.message.length ||
        !commit.message.match(affectsDelimiter)
    ) {
        return;
    }

    function reducer(affects, currentMessageLine) {
        if (affects.done || currentMessageLine.length === 0) {
            return affects;
        }

        if (affects.message.length > 0 || currentMessageLine.indexOf(affectsDelimiter) === 0) {
            if (currentMessageLine[currentMessageLine.length - 1] !== ",") {
                affects.done = true;
            }

            affects.message += currentMessageLine + " ";
            return affects;
        }

        return affects;
    }

    const affectsLine = commit.message
        .split("\n")
        .reduce(reducer, { message: "", done: false })
        .message.trim();

    return affectsLine;
}
