# Assignment 1 (CYSE 411): Secure Status Portal

## Learning Goals
You will practice JavaScript fundamentals and browser web programming concepts:
- Functions, variables, conditionals, and basic data structures
- DOM selection and safe DOM updates
- Event-driven programming (addEventListener)
- JSON parsing and validation
- Async execution: Promises + async/await
- Basic `fetch()` usage
- Browser-side state: localStorage, sessionStorage, cookie concepts

You will also apply a key security lesson:
> The browser is not trusted. Frontend logic can be modified by the user.

---

## Operation Glass Wall

### 🏢 The Setting

You are a junior Cyber Security Engineer at OmniCorp, a massive tech conglomerate. OmniCorp just launched their brand new Internal Status Portal, a dashboard where high-ranking executives and system administrators view system alerts, update their security profiles, and access restricted server rooms.

The senior developers built it quickly using pure JavaScript. They think it’s secure because "the code is hidden in the browser." Your Job: You’ve been tasked to audit and fix the prototype (src/app.js) before a notorious hacktivist group known as "The Null Pointer" exploits it. You know the golden rule of application security: Never trust the frontend.

### 🖥️ Act-by-Act Mission Briefing

As you solve each TODO in src/app.js, you aren't just writing code—you are actively stopping an attack vector.

### Act I: The Gateway (The Inputs)

#### 🚀 Mission 1: sanitizeUsername(input)

> ⚠️ **The Threat:** > Hackers are trying to inject malicious scripts into their usernames to hijack the sessions of HR managers.

- Objective: Neutralize incoming string data to prevent Cross-Site Scripting (XSS).

- Constraint: Implement sanitization using REGEX (https://www.w3schools.com/JS/js_regexp.asp).


#### 🚀 Mission 2: renderNotifications(listEl, notifications)

> ⚠️ **The Threat** > A clever attacker managed to slip a Cross-Site Scripting (XSS) payload into a system notification. If you use innerHTML, the moment an executive opens their dashboard, the hacker steals their admin cookie.

- Your Goal: Defuse the XSS bomb. Use safe DOM updates to render the notifications like an armored glass window—visible, but impenetrable.

---


### 🖥️ Act II: The Data Vault (The Parser & Fetcher)

#### 🚀 Mission 3: parseProfileJson(jsonText)

> ⚠️ **The Threat** > Attackers are sending malformed, corrupted, or "JSON-bomb" profiles to crash the portal, causing a Denial of Service (DoS) on the client side.

- Your Goal: Build a secure airlock. Implement robust try/catch validation that inspects the JSON payload safely without swallowing critical system exceptions blindly.


#### 🚀 Mission 4: fetchUserProfile(url)


> ⚠️ **The Threat** > The portal needs to fetch profile data from an internal API. If the connection fails or gets intercepted (Man-in-the-Middle), the application might break or leak information.

- Your Goal: Establish a secure, asynchronous data pipeline using Promises and async/await to handle data streams cleanly.

---

### 🖥️ Act III: The Persistence Layer (The Brains)


#### 🚀 Mission 5 & 6: saveSessionToStorage(profile) & loadSessionFromStorage()

> ⚠️ **The Threat** > Users leave their computers unlocked, or other scripts on the page try to scrape data. If you store sensitive credentials insecurely, it's game over.

- Your Goal: Organize the browser's memory. Correctly separate what belongs in ephemeral sessionStorage versus persistent localStorage based on the threat model.

---

### 🖥️ Act IV: The Final Gatekeeper (The Illusion of Security)

#### 🚀 Mission 7: computeAccessStatus(profile)

> ⚠️ **The Threat** > The core lesson of the lab. You are writing code that checks if a user is an "admin". But wait... an attacker can literally open F12 Developer Tools, rewrite your JavaScript in the browser, and force this function to return "ACCESS GRANTED".

- Your Goal: Write the cleanest, most defensive logic possible, while maintaining the engineering mindset: “This check keeps honest users out, but I must remind the backend team that they have to validate this token all over again on the server.”

---

### 🧪 Epilogue: The Virtual Simulation (Why We Read the Tests)

The README highlights why looking at the deployment/tests matters. In our story, the autograder (npm test) is the automated cyber-range simulator. Running npm test is the equivalent of spinning up an automated AI hacker bot that fires edge cases, malformed JSON, and script injections at your code. Passing the autograder means your defenses held up against the simulation, and OmniCorp's portal is safe for another day.

_Good luck, Agent_. 

---

## Assignment Directions

### 🛑 General Constraints

- Use only the content learned in Unit 1.2 and 1.3.
- No frameworks, no external sanitization libraries.
- Use safe DOM updates: do not use innerHTML for untrusted strings.


### How to Run the Environment

- Clone the repository for your computer

- Save the repo in your onw repo

- Install dependencies
> npm install

- Run the code
> open the file public/index.html in the browser

- Run all tests (check if your changes are correct)
> npm test

- Run specific test
> npm test <name_of_test>

---

### Submission

- Ensure you have the work saved in your own repository

- Ensure you have pushed all the changes to your repo

- Ensure that the repo is public

- In Canvas, save the link to clone your repo (e.g., https://github.com/GMU-CYSE/ASS1-SUMMER26.git)

- After you submit, you cannot make any changes (GitHub will track them). If you make changes after the submission, your assignment will receive zero.

---

### Support

- JavaScript Tutorial: https://www.w3schools.com/jS/

---

## 📊 Evaluation Rubric: CYSE 411 - Assignment 1 (Max: 100 Points)

| Component / Mission | Security & Technical Focus | Incomplete / Insufficient (0% to 35%) | Intermediate Achievement (36% to 75%) | Excellent / Secure (76% to 100%) | Max Points |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Mission 1**<br>`sanitizeUsername` | **Input Sanitization & Allowlist Controls** | Returns hardcoded/static values or relies on an endless chain of manual `.replace()` statements to guess bad characters. | Clears out most unsafe characters and respects the maximum string length, but **fails to use Regular Expressions**, triggering a strict inspection failure. | Leverages a resilient character allowlist Regular Expression that permits only specified safe alphanumeric/punctuation characters, maps failures to underscores, enforces a strict 20-character limit, and passes 100% of tests. | **15 pts** |
| **Mission 2**<br>`renderNotifications` | **Structural DOM Protection against XSS** | Fails to clear out historical node sequences (`<li>` tags stack up forever) or appends untrusted content raw into the browser DOM. | Successfully purges the old notification listing and creates new list structures, but breaks when handling empty arrays or risks injection flaws. | Thoroughly resets the parent wrapper node (`listEl.innerHTML = ""`) and utilizes **strictly `textContent`** to populate the dynamically built `<li>` tags safely. | **15 pts** |
| **Mission 3**<br>`parseProfileJson` | **Schema Validation & Denial of Service (DoS) Hardening** | Attempts to process broken or manipulated json payloads directly, letting parsing exceptions crash the client-side system process. | Wraps the execution block within an explicit `try/catch` safety net, but entirely omits property data type checking or mistakenly permits unsafe data configurations (e.g., admitting an unapproved administrative role). | Implements robust `try/catch` exception isolation alongside rigid type schema checking for all required object properties and explicitly allowed roles. Drops bad states cleanly to `null`. | **15 pts** |
| **Mission 4**<br>`fetchUserProfile` | **Asynchronous Data Pipelines & Connection Validation** | Fails to write proper non-blocking asynchronous loops or bypasses standard promise resolution mechanisms. | Seamlessly deploys `async/await` runtime loops to issue a client-side `fetch()` request, but completely ignores network transaction health flags or attempts immediate extraction errors. | Smoothly orchestrates asynchronous flows using `fetch + await`, safely validates the transactional health via server response verification, extracts network data to a raw text stream, and pipes the text context directly into the schema parser. | **15 pts** |
| **Mission 5 & 6**<br>`Storage` (Save & Load) | **Client-Side Data Leakage & State Management Privacy** | Fails to commit user settings entirely or serializes raw, highly credentialed objects into local storage without performing selective structural data filters. | Successfully records and deserializes standard object properties using JSON serialization methods, but leaks non-static parameters (like notifications arrays) or crashes upon processing tampered states. | **Write Routine:** Reconstructs a strict subset containing *exclusively* non-sensitive details as dictated by the least-privilege storage model. <br><br>**Read Routine:** Uses the dedicated global storage key definition and falls back cleanly to `null` if database records are empty or corrupt. | **25 pts** |
| **Mission 7**<br>`computeAccessStatus` | **Defensive Engineering & Fail-Closed Access Modeling** | Misses role verification checks entirely, experiences errors when analyzing null entities, or responds with strings that break structural definitions. | Handles happy path operations flawlessly (validates standard administrative role variables correctly), but experiences operational crashes when processing incomplete, corrupted, or uninitialized user state inputs. | Comprehensively ensures both the incoming root object and its nested properties exist, enforces strict type identity checks to authorize high-privilege access strings, and securely handles all edge cases with an explicit **Fail-Closed fallback default**. | **15 pts** |

---

## 🛑 Penalty Ledger (Subtractive Deductions)

| System / Policy Violation | Score Impact | Core Security Contextual Rationale |
| :--- | :--- | :--- |
| **Use of Frameworks or Third-Party Sanitization Engines** | **-100 Points (Automatic Zero)** | Violates the primary architectural boundary of the task, requiring exclusive dependency on raw Vanilla JavaScript syntax. |
| **Using `innerHTML` / `outerHTML` for dynamic, untrusted string variables** | **-30 Points** | Actively opens the software application portal up to disastrous structural Cross-Site Scripting (XSS) client-side attacks. |
| **Syntax errors that completely obstruct the `npm test` execution environment** | **-20 Points** | Disables automated test suites, blocking the local simulation pipeline and autograder framework checks entirely. |

---


