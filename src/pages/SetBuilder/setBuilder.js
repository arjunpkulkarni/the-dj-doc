import React, { useState, useEffect } from "react";
import "/Users/arjunkulkarni/Desktop/the-dj-doc/src/pages/SetBuilder/setBuilder.css";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

function SetBuilder() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [apiResponse, setApiResponse] = useState(""); // Add this state

  const chat = async (e, message) => {
    e.preventDefault();

    setIsTyping(true);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);
    setMessage("");

    await openai
      .chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are SetBuilder, you are only meant to help recommend songs for a DJ Set based on the criteria that the user wants, whether it is the time of the DJ Set or the type of party, or the types of genres they want in it. Always ask for the criteria they want before generating anything. If you are asked any other questions besides dj set questions or song reccomendations, you should say that you are not meant for that task.",
          },
          {
            role: "assistant",
            content: "Sure! Here are some song recommendations for your 45-minute beach party DJ set:\n\n1. 'Summer Vibes' by Artist1 (Reggae)\n2. 'Beach Groove' by Artist2 (Hip-Hop)\n3. 'Sunset Rave' by Artist3 (EDM)"
          },
          ...chats,
        ],
        temperature: 1, // Adjust the temperature value as needed
      })
      .then((result) => {
        const aiResponse = result.choices[0].message
        console.log(aiResponse);
        msgs.push(aiResponse);
        setChats(msgs);
        setIsTyping(false);

        // Set the API response in the state
        setApiResponse(result.data.choices[0].message);
      })
      .catch((error) => console.log(error));
  };

  return (
    <main>
      

      <section className="setbuilder_section">
      <h1 className="setbuilder_head">SetBuilder</h1>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span> : </span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>



      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="What type of DJ Set do you want?"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default SetBuilder;
