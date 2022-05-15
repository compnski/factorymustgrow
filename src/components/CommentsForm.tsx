import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { FactoryGameState } from "../factoryGameState";

import "./CommentsForm.scss";

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
    console.log("sending feedback");
    const resp = await fetch(
      "https://my-worker-production.factorymustgrow.workers.dev/",
      {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          comment: commentText,
          state: checked ? props.gameState : {},
          userName: "",
          userEmail: emailText,
          feeling: "N/A",
        }),
      }
    );
    console.log(resp);
    setCommentText("");
    setFormOpen(false);
  }

  return (
    <div className={`comments-form ${formOpen ? "open" : ""}`}>
      <div onClick={() => setFormOpen(!formOpen)} className="title">
        <span className="material-icons">comment</span> Comments
      </div>
      <form className="form" onSubmit={sendFeedback}>
        <textarea
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
            name="email"
            type="email"
            placeholder="e-mail if you want a response"
            onChange={handleEmailChange}
            value={emailText}
          />
        </label>
        <label>
          <button>Submit!</button>
        </label>
      </form>
    </div>
  );
}
