"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

// Placeholder Modal Contents (would be their own components)

function SessionForm({ onClose }) {
  const [category, setCategory] = useState("React / Next.js");
  const [topic, setTopic] = useState("");
  const updateDayLog = useAppStore(state => state.updateDayLog);

  const handleSave = () => {
    updateDayLog("ADD_SESSION", {
      category,
      topic,
      platform: "Web",
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: "Ongoing",
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 rounded border border-border bg-surface">
          <option>React / Next.js</option>
          <option>DSA</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Topic</label>
        <input value={topic} onChange={e => setTopic(e.target.value)} type="text" className="w-full p-2 rounded border border-border bg-surface" placeholder="e.g. useCallback deep dive" />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Session</Button>
      </div>
    </div>
  );
}

function MealForm({ onClose }) {
  const [type, setType] = useState("Breakfast");
  const updateDayLog = useAppStore(state => state.updateDayLog);

  const handleSave = () => {
    updateDayLog("ADD_MEAL", {
      type,
      description: "Logged Meal",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHealthy: true,
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Meal Type</label>
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 rounded border border-border bg-surface">
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Meal</Button>
      </div>
    </div>
  );
}

function ExerciseForm({ onClose }) {
  const [type, setType] = useState("Gym");
  const updateDayLog = useAppStore(state => state.updateDayLog);

  const handleSave = () => {
    updateDayLog("ADD_EXERCISE", {
      done: true,
      type,
      durationMinutes: 45,
      notes: "Quick log from dashboard"
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Exercise Type</label>
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 rounded border border-border bg-surface">
          <option>Gym</option>
          <option>Run</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Exercise</Button>
      </div>
    </div>
  );
}

function MoodForm({ onClose }) {
  const [mood, setMood] = useState(3);
  const updateDayLog = useAppStore(state => state.updateDayLog);

  const handleSave = () => {
    updateDayLog("UPDATE_MOOD", mood);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Mood (1-5): {mood}</label>
        <input value={mood} onChange={e => setMood(parseInt(e.target.value))} type="range" min="1" max="5" className="w-full" />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Mood</Button>
      </div>
    </div>
  );
}

export function GlobalModals() {
  const { activeModal, setActiveModal } = useAppStore();

  const close = () => setActiveModal(null);

  return (
    <>
      <Modal isOpen={activeModal === "session"} onClose={close} title="Log Work Session">
        <SessionForm onClose={close} />
      </Modal>
      <Modal isOpen={activeModal === "meal"} onClose={close} title="Log Meal">
        <MealForm onClose={close} />
      </Modal>
      <Modal isOpen={activeModal === "exercise"} onClose={close} title="Log Exercise">
        <ExerciseForm onClose={close} />
      </Modal>
      <Modal isOpen={activeModal === "mood"} onClose={close} title="Log Mood">
        <MoodForm onClose={close} />
      </Modal>
    </>
  );
}
