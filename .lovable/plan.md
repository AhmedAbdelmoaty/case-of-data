

# Fix: InteractiveDialogue skips choices and jumps to result

## Root Cause
In `InteractiveDialogue.tsx`, `isAtChoicePoint` is computed at **render time** using `currentLineIndex`, but by the time `handleNext` needs it, the player has already consumed the last resolved line. The stale value causes the fallthrough `else` branch to fire `onComplete()`.

## Fix (single file: `src/components/game/InteractiveDialogue.tsx`)

Replace the `handleNext` function to compute the choice-point check **inline** at click time instead of relying on the render-time `isAtChoicePoint` variable:

```typescript
const handleNext = () => {
  if (isTyping && currentLine) {
    setDisplayedText(currentLine.text);
    setIsTyping(false);
    if (currentLine.isSaveable) setShowSaveButton(true);
    return;
  }

  const nextIndex = currentLineIndex + 1;

  if (nextIndex < resolvedLines.length) {
    setCurrentLineIndex(nextIndex);
  } else {
    // Check choice point NOW with nextIndex
    const atChoice = timelineIndex < timeline.length && 
      timeline[timelineIndex]?.type === "choice";
    
    if (atChoice) {
      const entry = timeline[timelineIndex];
      setCurrentChoiceOptions(shuffleArray(entry.options || []));
      setShowChoices(true);
    } else if (timelineIndex >= timeline.length) {
      onComplete?.();
    }
    // Remove the dangerous else fallthrough that called onComplete
  }
};
```

Also remove the now-unused `isAtChoicePoint` const (line 161-163).

This is a one-line logic fix — no UI or data changes needed.

