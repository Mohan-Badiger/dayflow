"use client";
import { useAppStore } from "@/store/useAppStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

// Placeholder Modal Contents (would be their own components)

function SessionForm({ onClose }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select className="w-full p-2 rounded border border-(--border) bg-(--background)">
          <option>React / Next.js</option>
          <option>DSA</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Topic</label>
        <input type="text" className="w-full p-2 rounded border border-(--border) bg-(--background)" placeholder="e.g. useCallback deep dive" />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button>Save Session</Button>
      </div>
    </div>
  );
}

function MealForm({ onClose }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Meal Type</label>
        <select className="w-full p-2 rounded border border-(--border) bg-(--background)">
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button>Save Meal</Button>
      </div>
    </div>
  );
}

function ExerciseForm({ onClose }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Exercise Type</label>
        <select className="w-full p-2 rounded border border-(--border) bg-(--background)">
          <option>Gym</option>
          <option>Run</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button>Save Exercise</Button>
      </div>
    </div>
  );
}

function MoodForm({ onClose }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Mood (1-5)</label>
        <input type="range" min="1" max="5" className="w-full" />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button>Save Mood</Button>
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
