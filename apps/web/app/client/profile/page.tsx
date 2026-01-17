"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Scale, Target, Activity, AlertCircle, CheckCircle } from "lucide-react";

// Demo profile data
const demoProfile = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah@example.com",
  currentWeight: 165,
  targetWeight: 145,
  height: 165, // cm
  dateOfBirth: "1990-05-15",
  activityLevel: "moderate",
  dietaryRestrictions: ["gluten-free", "dairy-free"],
  goals: "Lose 20 lbs and build healthy eating habits",
};

const activityLevels = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "light", label: "Light", description: "Light exercise 1-3 days/week" },
  { value: "moderate", label: "Moderate", description: "Moderate exercise 3-5 days/week" },
  { value: "active", label: "Active", description: "Hard exercise 6-7 days/week" },
  { value: "very_active", label: "Very Active", description: "Very hard exercise, physical job" },
];

const commonRestrictions = [
  "gluten-free",
  "dairy-free",
  "vegetarian",
  "vegan",
  "keto",
  "low-carb",
  "nut-free",
  "shellfish-free",
];

export default function ProfilePage(): React.JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    currentWeight: demoProfile.currentWeight.toString(),
    targetWeight: demoProfile.targetWeight.toString(),
    height: demoProfile.height.toString(),
    dateOfBirth: demoProfile.dateOfBirth,
    activityLevel: demoProfile.activityLevel,
    dietaryRestrictions: demoProfile.dietaryRestrictions,
    goals: demoProfile.goals,
  });

  const handleSave = (): void => {
    // In production, this would PATCH to /api/clients/:id/health-profile
    console.log("Saving profile:", formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleRestriction = (restriction: string): void => {
    setFormData({
      ...formData,
      dietaryRestrictions: formData.dietaryRestrictions.includes(restriction)
        ? formData.dietaryRestrictions.filter((r) => r !== restriction)
        : [...formData.dietaryRestrictions, restriction],
    });
  };

  const heightInFeetInches = (cm: number): string => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nooch-dark">Health Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Keep your information up to date for personalized coaching
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {saved && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-700">Profile updated successfully!</p>
          </CardContent>
        </Card>
      )}

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5 text-coral-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <p className="font-medium">
                {demoProfile.firstName} {demoProfile.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="font-medium">{demoProfile.email}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-200"
                />
              ) : (
                <p className="font-medium">
                  {new Date(formData.dateOfBirth).toLocaleDateString()}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Height</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-24 rounded-lg border px-3 py-2 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-200"
                  />
                  <span className="text-muted-foreground">cm</span>
                </div>
              ) : (
                <p className="font-medium">
                  {heightInFeetInches(Number(formData.height))} ({formData.height} cm)
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Scale className="h-5 w-5 text-coral-500" />
            Weight Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Current Weight</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.currentWeight}
                    onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                    className="w-24 rounded-lg border px-3 py-2 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-200"
                  />
                  <span className="text-muted-foreground">lbs</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{formData.currentWeight} lbs</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Target Weight</label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                    className="w-24 rounded-lg border px-3 py-2 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-200"
                  />
                  <span className="text-muted-foreground">lbs</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-600">{formData.targetWeight} lbs</p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress to goal</span>
              <span>
                {Number(formData.currentWeight) - Number(formData.targetWeight)} lbs to go
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-coral-400 to-coral-500"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      ((185 - Number(formData.currentWeight)) /
                        (185 - Number(formData.targetWeight))) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-coral-500" />
            Activity Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    formData.activityLevel === level.value
                      ? "border-coral-400 bg-coral-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium">{level.label}</p>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium capitalize">{formData.activityLevel}</p>
              <p className="text-sm text-muted-foreground">
                {activityLevels.find((l) => l.value === formData.activityLevel)?.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="h-5 w-5 text-coral-500" />
            Dietary Restrictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {commonRestrictions.map((restriction) => (
                <button
                  key={restriction}
                  onClick={() => toggleRestriction(restriction)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    formData.dietaryRestrictions.includes(restriction)
                      ? "bg-coral-400 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {restriction}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {formData.dietaryRestrictions.length > 0 ? (
                formData.dietaryRestrictions.map((restriction) => (
                  <span
                    key={restriction}
                    className="rounded-full bg-coral-100 px-3 py-1 text-sm font-medium text-coral-700"
                  >
                    {restriction}
                  </span>
                ))
              ) : (
                <p className="text-muted-foreground">No dietary restrictions specified</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-coral-500" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="Describe your health and nutrition goals..."
              className="w-full rounded-lg border px-3 py-2 focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-200"
              rows={3}
            />
          ) : (
            <p className="text-muted-foreground">{formData.goals || "No goals specified"}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
