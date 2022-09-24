import 'dotenv/config';
import express from 'express';
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import {
    NEED_COMMAND,
    CHALLENGE_COMMAND,
    HasGuildCommands,
} from './commands.js';

import fs from 'fs';
import http from 'http';
import https from 'https';
import {addNeed} from "./api.js";

export async function discord_interaction(req, res ) {
// Interaction type and data
    console.log("req.body = " + JSON.stringify(req.body))
    const {type, id, data} = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({type: InteractionResponseType.PONG});
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const {name} = data;

        // "need" guild command
        if (name === 'a1') {
            // Add the need to the database

            console.log("OPTIONS = " + JSON.stringify(req.body.data.options));

            // Send a message into the channel where command was triggered from
            let need = {
                original_github_url: getNamedDiscordOptionField(req.body.data, 'url'),
                original_github_owner: 'original owner',
                description: getNamedDiscordOptionField(req.body.data, 'description'),
                target_os_name: getNamedDiscordOptionField(req.body.data, 'target_os_name'),
                target_os_version: getNamedDiscordOptionField(req.body.data, 'target_os_version'),
                target_name1: getNamedDiscordOptionField(req.body.data, 'target_name1'),
                target_version1: getNamedDiscordOptionField(req.body.data, 'target_version1'),
                target_name2: getNamedDiscordOptionField(req.body.data, 'target_name2'),
                target_version2: getNamedDiscordOptionField(req.body.data, 'target_version2'),
                languages: getNamedDiscordOptionField(req.body.data, 'languages')
            }
            let result = await addNeed(need)
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: 'Project added with ID A007609' + result.needid,
                },
            });
        }

        // "challenge" guild command
        if (name === 'challenge' && id) {
            const userId = req.body.member.user.id;
            // User's object choice
            const objectName = req.body.data.options[0].value;

            // Create active game using message ID as the game ID
            activeGames[id] = {
                id: userId,
                objectName,
            };

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: `Rock papers scissors challenge from <@${userId}>`,
                    components: [
                        {
                            type: MessageComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: MessageComponentTypes.BUTTON,
                                    // Append the game ID to use later on
                                    custom_id: `accept_button_${req.body.id}`,
                                    label: 'Accept',
                                    style: ButtonStyleTypes.PRIMARY,
                                },
                            ],
                        },
                    ],
                },
            });
        }
    }

    /**
     * Handle requests from interactive components
     * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
     */
    if (type === InteractionType.MESSAGE_COMPONENT) {
        // custom_id set in payload when sending message component
        const componentId = data.custom_id;

        if (componentId.startsWith('accept_button_')) {
            // get the associated game ID
            const gameId = componentId.replace('accept_button_', '');
            // Delete message with token in request body
            const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
            try {
                await res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        // Fetches a random emoji to send from a helper function
                        content: 'What is your object of choice?',
                        // Indicates it'll be an ephemeral message
                        flags: InteractionResponseFlags.EPHEMERAL,
                        components: [
                            {
                                type: MessageComponentTypes.ACTION_ROW,
                                components: [
                                    {
                                        type: MessageComponentTypes.STRING_SELECT,
                                        // Append game ID
                                        custom_id: `select_choice_${gameId}`,
                                        options: getShuffledOptions(),
                                    },
                                ],
                            },
                        ],
                    },
                });
                // Delete previous message
                await DiscordRequest(endpoint, {method: 'DELETE'});
            } catch (err) {
                console.error('Error sending message:', err);
            }
        } else if (componentId.startsWith('select_choice_')) {
            // get the associated game ID
            const gameId = componentId.replace('select_choice_', '');

            if (activeGames[gameId]) {
                // Get user ID and object choice for responding user
                const userId = req.body.member.user.id;
                const objectName = data.values[0];
                // Calculate result from helper function
                const resultStr = getResult(activeGames[gameId], {
                    id: userId,
                    objectName,
                });

                // Remove game from storage
                delete activeGames[gameId];
                // Update message with token in request body
                const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

                try {
                    // Send results
                    await res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {content: resultStr},
                    });
                    // Update ephemeral message
                    await DiscordRequest(endpoint, {
                        method: 'PATCH',
                        body: {
                            content: 'Nice choice ' + getRandomEmoji(),
                            components: [],
                        },
                    });
                } catch (err) {
                    console.error('Error sending message:', err);
                }
            }
        }
    }
}

function getNamedDiscordOptionField( data, name ) {
    console.log("getNamedDiscordOptionField " + name)
    for( let i = 0; i < data.options.length; i++ ) {
        if( data.options[i].name === name ) {
            console.log("getNamedDiscordOptionField " + name +"="+data.options[i].value)
            return (data.options[i].value)
        }
    }
    return ''
}