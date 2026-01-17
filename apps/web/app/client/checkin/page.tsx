"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Scale, Smile, Frown, Meh } from "lucide-react";

export default function CheckinPage(): React.JSX.Element {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    complianceScore: 5,
    currentWeight: "",
    notes: "",
    struggles: "",
    wins: "",
  });

  const handleSubmit = (): void => {
    // In production, this would POST to /api/checkins
    console.log("Submitting check-in:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Check-in Submitted!</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Great job staying consistent. Your coach will review your progress soon.
        </p>
        <Button className="mt-6" onClick={() => window.location.href = "/client"}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nooch-dark">Weekly Check-in</h1>
        <p className="mt-1 text-muted-foreground">
          Step {step} of 3 - Take a moment to reflect on your week
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${
              s <= step ? "bg-coral-400" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Compliance Score */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-coral-500" />
              How compliant were you this week?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              On a scale of 1-10, how well did you stick to your nutrition plan?
            </p>

            {/* Score Selector */}
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  onClick={() => setFormData({ ...formData, complianceScore: score })}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-all ${
                    formData.complianceScore === score
                      ? score >= 7
                        ? "bg-green-500 text-white ring-4 ring-green-200"
                        : score >= 4
                        ? "bg-yellow-500 text-white ring-4 ring-yellow-200"
                        : "bg-red-500 text-white ring-4 ring-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>

            {/* Score Feedback */}
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              {formData.complianceScore >= 8 ? (
                <div className="flex flex-col items-center gap-2">
                  <Smile className="h-8 w-8 text-green-500" />
                  <p className="font-medium text-green-700">Excellent week!</p>
                </div>
              ) : formData.complianceScore >= 5 ? (
                <div className="flex flex-col items-center gap-2">
                  <Meh className="h-8 w-8 text-yellow-500" />
                  <p className="font-medium text-yellow-700">Room for improvement</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Frown className="h-8 w-8 text-red-500" />
                  <p className="font-medium text-red-700">Tough week - let&apos;s talk about it</p>
                </div>
              )}
            </div>

            <Button className="w-full" onClick={() => setStep(2)}>
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Weight */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-coral-500" />
              What&apos;s your weight this week?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Weigh yourself at the same time each week for consistency (ideally morning, after bathroom)
            </p>

            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="165"
                value={formData.currentWeight}
                onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                className="w-32 rounded-lg border p-4 text-center text-3xl font-bold focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-200"
              />
              <span className="text-xl text-muted-foreground">lbs</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(3)}
                disabled={!formData.currentWeight}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Notes */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Reflect on your week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">What were your wins this week?</label>
              <Textarea
                placeholder="e.g., Meal prepped on Sunday, hit my protein goals 5 days, tried a new healthy recipe..."
                value={formData.wins}
                onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">What challenges did you face?</label>
              <Textarea
                placeholder="e.g., Stressful work week led to snacking, skipped lunch a few days, ate out more than planned..."
                value={formData.struggles}
                onChange={(e) => setFormData({ ...formData, struggles: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Anything else for your coach?</label>
              <Textarea
                placeholder="Questions, concerns, or updates..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1 bg-coral-500 hover:bg-coral-600" onClick={handleSubmit}>
                Submit Check-in
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground">Summary</p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Compliance: </span>
              <span className="font-medium">{formData.complianceScore}/10</span>
            </div>
            {formData.currentWeight && (
              <div>
                <span className="text-muted-foreground">Weight: </span>
                <span className="font-medium">{formData.currentWeight} lbs</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
