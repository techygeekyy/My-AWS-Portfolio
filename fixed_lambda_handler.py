import json
import copy

def lambda_handler(event, context):
    try:
        intent_name = event.get('sessionState', {}).get('intent', {}).get('name')
        slots = event.get('sessionState', {}).get('intent', {}).get('slots', {})

        # Extract UserName slot if present
        user_name = None
        if slots and slots.get('UserName') and slots['UserName'].get('value'):
            user_name = slots['UserName']['value'].get('interpretedValue')

        if not intent_name:
            return {
                "sessionState": {
                    "dialogAction": {"type": "Close"},
                    "intent": {"name": "FallbackIntent", "state": "Fulfilled"}
                },
                "messages": [
                    {"contentType": "PlainText", "content": "Invalid event format. No intent found"}
                ]
            }

        elif intent_name == "WelcomeIntent":
            slots = event.get('sessionState', {}).get('intent', {}).get('slots', {})
            user_name = None
            if user_name:  #Slot Captured
                response = {            
                    "sessionState": {
                        "dialogAction": {"type": "Close"},
                        "intent": {"name": intent_name, "state": "Fulfilled"}
                    },
                    "messages": [
                        {"contentType": "PlainText",
                         "content": f"👋 Welcome, {user_name}! You can ask me about my resume, projects, skills, experience, or contact details."},
                         {
                         "contentType": "ImageResponseCard",
                         "imageResponseCard": {
                             "title": "Choose an option",
                             "buttons": [
                                 {"text": "Resume", "value": "ShowResumeIntent"},
                                 {"text": "Projects", "value": "ShowProjectsIntent"},
                                 {"text": "Skills", "value": "SkillsIntent"},
                                 {"text": "Experience", "value": "ExperienceIntent"},
                                 {"text": "Contact", "value": "ContactIntent"}
                                 ]
                             }
                        }
                    ]
                }            
            else:
                response = {
                    "sessionState": {
                        "dialogAction": {"type": "ElicitSlot", "slotToElicit": "UserName"},
                        "intent": {"name": intent_name, "state": "InProgress"}
                    },
                    "messages": [
                        {"contentType": "PlainText",
                         "content": "May I know your name so I can greet you properly?"}
                    ]
                }

        elif intent_name == "ShowResumeIntent":
            response = {
                "sessionState": {...},
                "messages": [
                    {
                        "contentType": "ImageResponseCard",
                        "imageResponseCard": {
                            "title": "📄 My Resume",
                            "subtitle": "Click below to view",
                            "buttons": [
                                {"text": "View Resume", "value": "https://my-aws3-portfolio-website.s3.ap-south-1.amazonaws.com/cv.pdf"}
                            ]
                        }
                    }
                ]
            }

        elif intent_name == "ShowProjectsIntent":
            response = {
                "sessionState": {...},
                "messages": [
                    {
                        "contentType": "ImageResponseCard",
                        "imageResponseCard": {
                            "title": "🚀 My Projects",
                            "subtitle": "Highlights of my work",
                            "buttons": [
                                {"text": "Project A", "value": "http://my-aws3-portfolio-website.s3-website.ap-south-1.amazonaws.com/service-details.html"},
                                {"text": "Project B", "value": "https://example.com/projectB"},
                                {"text": "Project C", "value": "https://example.com/projectC"}
                            ]
                        }
                    }
                ]
            }

        # ... keep your other intents unchanged ...Changed

        else:
            response = {
                "sessionState": {
                    "dialogAction": {"type": "Close"},
                    "intent": {"name": intent_name, "state": "Fulfilled"}
                },
                "messages": [
                    {"contentType": "PlainText", "content": "🤔 I'm not sure I understood that."},
                    {"contentType": "PlainText", "content": "But I can share my resume or projects!"}
                ]
            }

        return response

    except Exception as e:
        return {
            "sessionState": {
                "dialogAction": {"type": "Close"},
                "intent": {"name": "ErrorIntent", "state": "Failed"}
            },
            "messages": [
                {"contentType": "PlainText", "content": f"❌ Error: {str(e)}"}
            ]
        }
