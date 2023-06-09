import Image from "next/image";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Chatmodal = ({ isOpen, handleToggleModal, description, game }) => {
  const [input, setInput] = useState();
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [outputHistory, setOutputHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const handleInput = (event) => {
    setInput(event.target.value);
  };
  useEffect(() => {
    AOS.init();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsTyping(true);
        if (description !== null) {
          // Add a conditional check for description
          const response = await fetch("/api/openai", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: description, outputTopic: game }),
          });
          const data = await response.json();

          setHistory((prevOutput) => [...prevOutput, description]);
          setOutput(data.message);
          setOutputHistory((prevOutput) => [...prevOutput, data.message]);
          setInput("");
          setOutput("");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsTyping(false); // Stop typing animation
      }
    };

    fetchData(); // Call fetchData function to trigger the API call
  }, [description]);

  const handleSubmit = async () => {
    try {
      setIsTyping(true);
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, outputTopic: game }),
      });
      const data = await response.json();
      setHistory((prevOutput) => [...prevOutput, input]);
      setOutput(data.message);
      setOutputHistory((prevOutput) => [...prevOutput, data.message]);
      setInput("");
      setOutput("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false); // Stop typing animation
    }
  };
  return (
    <>
      {isOpen && (
        <div
          id="staticModal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full  max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
                <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                  <div className="relative flex items-center space-x-4">
                    <div className="relative">
                      <span className="absolute text-green-500 right-0 bottom-0">
                        <svg width="20" height="20">
                          <circle
                            cx="8"
                            cy="8"
                            r="8"
                            fill="currentColor"
                          ></circle>
                        </svg>
                      </span>
                      <Image
                        className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                        src="/assets/images/bot.svg"
                        alt=""
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="text-2xl mt-1 flex items-center">
                        <span className="text-gray-700 mr-3 dark:text-white ">
                          WETIME Bot
                        </span>
                      </div>
                      <span className="text-lg text-gray-600 dark:text-white">
                        Automated Chat
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleToggleModal}
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="staticModal"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>{" "}
                  </div>
                </div>
                <div
                  id="messages"
                  className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                >
                  <div className="chat-message">
                    {history.map((message, index) => (
                      <React.Fragment key={index}>
                        <div>
                          <div className="flex flex-col text-xs w-full mx-2  items-start">
                            <div className="flex items-center bg-[#f1f5f9] dark:bg-[#1e293b] w-full h-auto p-5 rounded">
                              <Image
                                className="w-6 h-6 rounded-full"
                                src="/assets/images/user.svg"
                                alt="user"
                                width={10}
                                height={10}
                              />
                              <div>
                                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                                  {message}
                                  {/* {outputHistory[index]} */}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center bg-[#e2e8f0]  dark:bg-[#0f172a] w-full h-auto p-5 rounded">
                              <Image
                                className="w-6 h-6 rounded-full"
                                src="/assets/images/bot.svg"
                                alt=""
                                width={10}
                                height={10}
                              />
                              <div>
                                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                                  {outputHistory[index]}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="border-t-2 border-gray-200 px-4 pt-4 mb-[15px] sm:mb-0">
                  <div className="relative flex">
                    <span className="absolute inset-y-0 flex items-center">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          ></path>
                        </svg>
                      </button>
                    </span>
                    {isTyping && (
                      <div data-aos="fade-up" data-aos-duration="500">
                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          Typing...
                        </span>
                      </div>
                    )}
                    {!isTyping && (
                      <input
                        onChange={handleInput}
                        type="text"
                        value={input}
                        placeholder="Write your message!"
                        className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 dark:bg-[#0f172a] placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                      />
                    )}
                    <div className="absolute right-0 items-center inset-y-0 sm:flex">
                      <button
                        onClick={handleSubmit}
                        type="button"
                        className="bg-transparent inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-gray-700 dark:text-black  hover:bg-gray-300 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className=" h-6 w-6 ml-2 transform rotate-90"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatmodal;
