

type Props = {
    score: string | null;
};


export function ScoreSummary({score}: Props) {
    if (!score) {
        return (
            <span className="text-xs text-slate-400
            px-3 py-1 rounded-full border border-slate-200">Keine Bewertung</span>

        );
    }

    const [hardPart, softPart] = score.split("/");
    const hardValue = Number(hardPart.replace("hard", ""));
    const softValue = Number(softPart.replace("soft", ""));


    const color = 
    hardValue < 0 
    ? "bg-red-1000 text-red-800 border-red-200"
    : softValue < 0
    ? "bg-amber-100 text-amber-800 border-amber-200"
    : "bg-gree-100 text-green-800 border-green-200";

    return (
        <span className={`text-xs font-medium px-3 py-1 rounded-full
        border ${color}`}>
            {score}
        </span>
    )
}