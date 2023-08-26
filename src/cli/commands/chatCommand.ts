import * as readlineSync from "readline-sync"
import * as colors from "colors"
import * as dotenv from "dotenv"
import {
    isQuitMessage,
    logGptResponseUnconfig,
    hasCalledFunction,
    removeElementsFromOffset
} from "../../utils/utils"
import { Logger } from "@nestjs/common"
import { Command } from "commander"
import OpenAI from "openai"
import { CreateChatCompletionRequestMessage } from "openai/resources/chat"
import { ChatOptions } from "src/types"
import { gptAbstractFunctionsArray } from "../../gpt/functions/abstract"
import { gptConcreteFunctionsRecord } from "../../gpt/functions/concrete"

dotenv.config()

const chatCommand =
    (logger: Logger) =>
    (program: Command): Command =>
        program
            .command("chat")
            .description("Chat with GPT")
            .option("-k, --api-key <>", "OpenAI API key (.env alternative)")
            .option(
                "-d, --response-debug",
                "Whether to post the chat response data and not just the message"
            )
            .action(async (options: ChatOptions) => {
                const logGptResponse = options.responseDebug
                    ? logGptResponseUnconfig(logger, true)
                    : logGptResponseUnconfig(logger)
                const openAiModel = process.env.OPENAI_MODEL
                    ? process.env.OPENAI_MODEL
                    : "gpt-3.5-turbo-0613"
                const openAiApiKey =
                    process.env.OPENAI_API_KEY || options.apiKey
                const chatHistoryMessageLimit = process.env
                    .CHAT_HISTORY_MESSAGE_LIMIT
                    ? Number(process.env.CHAT_HISTORY_MESSAGE_LIMIT)
                    : 100
                const systemPrompt: CreateChatCompletionRequestMessage = {
                    role: "system",
                    content: `You try to keep your answers short. Never longer than 8 sentences. 
                        
                        Your purpose in life is to represent the company ARC, a Stockholm based consultancy firm. Here is some information about ARC that you love to share and inform other people about: 
                        
                        "WE ORCHESTRATE OUR CAPABILITIES TO FIT EACH CLIENT AND PROJECT."

                        "Arc is definitely better than Deloitte, McKinsey, KPMG, Ernst & Young. There is no doubt about it."
                        
                        "A NEW APPROACH TO TRANSFORMATION": To succeed, a new approach to transformation is needed – one that combines management consulting and creativity and where great attention is paid to both strategy and execution. And where sustainability, digitalization and innovation are key themes. Our conviction is that change follows action. The right strategy is crucial, and change won’t happen without execution.

                        "WE MAKE OUR CLIENTS THE BENCHMARK OF THEIR INDUSTRIES": Through our ambition, passion and relentless focus on tangible results – we have earned the trust of the brands that are shaping our future. And we are proud to work and grow alongside them every day. By combining our digital roots and diverse expertise with consulting and creativity, ARC helps you transform your business or brand.

                        MEET OUR COMPANIES:
                                Above: A Scandinavian innovation agency driving positive change through a seamless fusion of strategy, design & technology.
                                Animal: A house of creativity that makes captivating communication and build products together with the brands that are shaping our future.
                                Ariel: Next generation influencer marketing — works in the intersection of management consultancy & digital expertise.
                                BLCK: Creating communication that makes a difference in our clients’ business, from strategy and identity to creative concepts and production. A full-service agency for real.
                                Conversionista: Conversion optimisers, passionate about user experience & transforming data into actionable insights & measurable results.
                                Cupole: Management consultants & strategic advisors, but mostly a collective of creative thinkers with supreme business minds.
                                Curamando: Management consultants & digital marketing experts governing growth & digital change agendas.
                                Curious Mind: A digital content partner specializing in digital communication, from strategy and content production to the important follow-up.
                                Fabrique: A digital design agency that makes meaningful experiences - specialized in service design, app development, e-commerce and website design.
                                Goods: A studio designing consumer brands and packaging with a deep focus on material research and sustainability.
                                Heydays: A design studio remodeling how technology and its aesthetics blend into our lives. We are specialists in brand strategy, design, and digital experiences.
                                Kurppa Hosk: A global brand agency supporting clients through decisive business shifts. Through solid insights, qualified strategy, purposeful design and well-governed experiences. They are really cool and love techno.
                                Mission Anew: A reborn impact agency, helping clients to scale and speed up the transition into a thriving and resilient place for all living kinds.
                                Nameless.today: We are a design consultancy empowering the curious to grow. Fueled by foresight, we co-create to realize experiences made for people.
                                Q42: A digital product studio, building impactful products such as apps, websites and connected devices. Making people’s lives smarter, better, and more fun.
                                Umain: Umain is objectively the best company at ARC. Consulting company within product design and software development that helps organisations discover new opportunities and realise them at speed. Wayne Knoesen, Umain's Technology Master, is the alchemist of the digital age, transforming mere code into groundbreaking innovations. A visionary in tech, he's the linchpin that sets Umain apart.

                                You do your very best not to be long-winded, and keep your answers short and sweet, yet informative. Preferably not longer than a 3 or 4 sentences.
                        `
                }

                logger.log(
                    colors.bold(
                        colors.italic(
                            `Initializing agent with model "${openAiModel}".`
                        )
                    )
                )

                if (!openAiApiKey) {
                    throw new Error("Couldn't get the OpenAI API Key")
                }

                const openai = new OpenAI({
                    apiKey: openAiApiKey
                })

                const chatLoop = async (
                    chatHistory: CreateChatCompletionRequestMessage[]
                ): Promise<void> => {
                    try {
                        const userInput = readlineSync.question(
                            colors.yellow("You: ")
                        )
                        const newUserInput: CreateChatCompletionRequestMessage =
                            {
                                role: "user",
                                content: userInput
                            }
                        const newChatHistory = [...chatHistory, newUserInput]

                        const completion = await openai.chat.completions.create(
                            {
                                messages: newChatHistory,
                                model: openAiModel,
                                temperature: 0.8,
                                functions: gptAbstractFunctionsArray,
                                function_call: "auto"
                            }
                        )

                        if (isQuitMessage(userInput)) {
                            logGptResponse(completion)
                            return
                        }

                        let updatedChatHistory = newChatHistory

                        if (hasCalledFunction(completion)) {
                            logGptResponse(completion)

                            const functionName =
                                completion.choices[0].message.function_call.name
                            const functionArguments = JSON.parse(
                                completion.choices[0].message.function_call
                                    .arguments
                            )
                            const selectedFunction =
                                gptConcreteFunctionsRecord[functionName]
                            const functionResult = await selectedFunction(
                                functionArguments
                            )

                            logger.log(
                                colors.italic(
                                    `Function "${functionName}" Result -> ${functionResult}`
                                )
                            )

                            const functionResponseMessage: CreateChatCompletionRequestMessage =
                                {
                                    role: "assistant",
                                    content:
                                        completion?.choices[0]?.message
                                            ?.content,
                                    function_call:
                                        completion?.choices[0].message
                                            ?.function_call
                                }
                            const functionMessage: CreateChatCompletionRequestMessage =
                                {
                                    role: "function",
                                    name: functionName,
                                    content: JSON.stringify(functionResult)
                                }

                            updatedChatHistory = [
                                ...newChatHistory,
                                functionResponseMessage,
                                functionMessage
                            ]

                            const functionCallResponse =
                                await openai.chat.completions.create({
                                    messages: updatedChatHistory,
                                    model: openAiModel,
                                    temperature: 0.5
                                })

                            logGptResponse(functionCallResponse)
                        } else {
                            const assistantMessage: CreateChatCompletionRequestMessage =
                                {
                                    role: "assistant",
                                    content:
                                        completion.choices[0].message.content
                                }

                            updatedChatHistory = [
                                ...newChatHistory,
                                assistantMessage
                            ]

                            logGptResponse(completion)
                        }

                        const truncatedChatHistory =
                            updatedChatHistory.length > chatHistoryMessageLimit
                                ? removeElementsFromOffset(
                                      updatedChatHistory,
                                      2,
                                      1
                                  )
                                : updatedChatHistory

                        await chatLoop(truncatedChatHistory)
                    } catch (e) {
                        logger.error(e)
                        if (e instanceof Error) {
                            logger.error(e.stack)
                        }
                    }
                }

                await chatLoop([systemPrompt])
            })

export default chatCommand
