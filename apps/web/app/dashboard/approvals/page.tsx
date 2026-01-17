import { ApprovalQueue } from "@/components/approvals/ApprovalQueue";

// Demo approval data
const demoApprovals = [
  {
    id: "1",
    originalContent:
      "Great job on hitting your protein target today! Based on your progress, I'd suggest adding another 100 calories from complex carbs to fuel your workouts. Try adding a small portion of oatmeal or sweet potato with your lunch. Keep up the excellent work!",
    confidence: 0.87,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    message: {
      conversation: {
        clientProfile: {
          user: {
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah@example.com",
            imageUrl: null,
          },
        },
        messages: [
          {
            content:
              "Just logged my meals for today - hit 140g protein! Should I be eating more carbs though? Feeling a bit tired during workouts.",
          },
        ],
      },
    },
  },
  {
    id: "2",
    originalContent:
      "I understand the temptation is real! For social events, I recommend eating a protein-rich snack beforehand so you're not starving when you arrive. Focus on the veggie trays and lean proteins at the party. It's okay to enjoy a small treat - just be mindful of portions. You've got this!",
    confidence: 0.82,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    message: {
      conversation: {
        clientProfile: {
          user: {
            firstName: "Mike",
            lastName: "Chen",
            email: "mike@example.com",
            imageUrl: null,
          },
        },
        messages: [
          {
            content:
              "I have a party this weekend and I'm worried about sticking to my plan. Any tips?",
          },
        ],
      },
    },
  },
];

export default function ApprovalsPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-nooch-dark">
          Approval Queue
        </h1>
        <p className="mt-1 font-mono text-sm text-nooch-gray">
          <span className="text-coral-400">$</span> nooch review --pending --approve
        </p>
      </div>

      {demoApprovals.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-nooch-light p-12 text-center">
          <h3 className="text-lg font-semibold text-nooch-dark">
            All caught up!
          </h3>
          <p className="mt-1 text-nooch-gray">
            No pending approvals at the moment.
          </p>
        </div>
      ) : (
        <ApprovalQueue approvals={demoApprovals} />
      )}
    </div>
  );
}
