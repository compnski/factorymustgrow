import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FactoryGameState } from "../factoryGameState";
import "./CommentsForm.scss";

const backendUrl =
  "https://factorymustgrow-production.factorymustgrow.workers.dev";

type CommentsFormProps = {
  gameState: FactoryGameState;
};
export function CommentsForm(props: CommentsFormProps) {
  const [checked, setChecked] = useState<boolean>(() => {
    const saved = localStorage.getItem("sendStateChecked") || "true";
    const savedValue = JSON.parse(saved) as boolean;
    return saved == undefined ? true : savedValue;
  });

  const [formOpen, setFormOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleCheckedChange = () => {
    setChecked(!checked);
  };

  const handleCommentChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(evt.target.value);
  };

  const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setEmailText(evt.target.value);
  };

  useEffect(() => {
    // storing input name
    localStorage.setItem("sendStateChecked", JSON.stringify(checked));
  }, [checked]);

  async function sendFeedback(evt: FormEvent) {
    evt.preventDefault();
    setError(undefined);
    try {
      console.log("sending feedback");
      const resp = await fetch(backendUrl, {
        method: "POST",
        body: JSON.stringify({
          comment: commentText,
          state: checked ? props.gameState : {},
          userName: "",
          userEmail: emailText,
          feeling: "N/A",
        }),
      });
      console.log(resp);
      setCommentText("");
      setFormOpen(false);
    } catch (e) {
      if (e instanceof Error) setError(`Error: ${e.message}`);
    }
  }

  return (
    <div className={`comments-form ${formOpen ? "open" : ""}`}>
      <div onClick={() => setFormOpen(!formOpen)} className="title">
        <span className="material-icons">comment</span> Comments
      </div>
      <form className="form" onSubmit={sendFeedback}>
        <textarea
          className="border border-gray-500 p-1"
          rows={5}
          placeholder="All feedback appreciated!"
          value={commentText}
          onChange={handleCommentChange}
        />
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckedChange}
          />
          Send GameState?
        </label>
        <label>
          <input
            className="border border-gray-500 p-1"
            name="email"
            type="email"
            placeholder="e-mail if you want a response"
            onChange={handleEmailChange}
            value={emailText}
          />
        </label>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <label>
          <button className="border border-gray-500 p-2 w-32 bg-gray-300">
            Submit!
          </button>
        </label>
      </form>
    </div>
  );
}
