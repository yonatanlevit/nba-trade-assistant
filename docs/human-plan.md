# Human Plan

## Goal

Build a chat-based system that helps an NBA general manager find valid trade packages for acquiring a specific player.

The use case is simple: the scouting team identifies a target player, and the GM wants to know which valid trade packages could bring that player to their team.

For example:

> **"I'm Boston and I want LeBron James."**

The system searches for valid two-team trade packages that would allow Boston to acquire the requested player.

## Scope

The user provides:

* The team they represent
* The player they want to acquire

If either is missing, the assistant asks a follow-up question.

For example:

> **User:** I want LeBron James.
> **Assistant:** Which team are you representing?
> **User:** Boston.

If the team or target player is ambiguous, the assistant asks for clarification. If either cannot be found, the assistant clearly informs the user instead of running a search.

The user does not need to provide the player's full name if the input uniquely identifies a player. If the provided name matches multiple players, the assistant presents the matching players and their teams and asks the user to clarify which player they mean before continuing.

If the target player already belongs to the user's team, no trade search is performed. The assistant clearly informs the user that the player is already on their roster and cannot be acquired through a trade.

Once both the team and target player are known, valid, and unambiguous, the assistant summarizes the understood search criteria and asks the user to confirm them. The trade search runs only after the user confirms.

For example:

> **Assistant:** You're representing Boston and want to acquire LeBron James. Should I search for valid trades?
> **User:** Yes.
> **Assistant:** Confirmed. I'll search for valid trade packages.

Every trade is limited to two teams. The user's team receives exactly the requested target player and sends a package of one to three players in return.

The MVP limits outgoing trade packages to at most three players to balance flexibility, realism, and simplicity. Given that the MVP only supports two-team player-for-player trades and excludes draft picks, free agents, and sign-and-trades, packages of one to three outgoing players provide a realistic scope for the trade scenarios being modeled. Allowing larger packages would significantly increase the number of possible combinations while adding limited value to the prototype and making the results harder to scan and compare.

After each turn, the assistant reflects the current criteria and asks for any missing or ambiguous information.

If the user changes their team or target player after previously confirming a search, the previous confirmation is invalidated. The assistant reflects the updated criteria and asks for confirmation again before running a new search.

For exmaple:
> **Assistant**: You're representing Boston and want to acquire LeBron James. Should I search for valid trades?
> **User**: Yes.
> **Assistant**: Confirmed. I'll search for valid trade packages.
> **User**: Actually, I want Stephen Curry instead.
> **Assistant**: You're still representing Boston, but your target player is now Stephen Curry. Should I search for valid trades for Stephen Curry?
> **User**: Yes.
> **Assistant**: Confirmed. I'll run a new search for valid trade packages.

## Harness & Tools

The assistant is responsible for understanding the user's request and keeping track of the selected team and target player.

If information is missing or unclear, the assistant asks a follow-up question.

Once the user confirms the search criteria, the assistant starts the trade search.

The application code generates the possible trade packages and checks whether each trade is valid. The LLM does not decide trade legality itself.

## Acceptance Criteria

The MVP is successful if:

* The user can provide their team and target player through natural-language chat.
* Missing information triggers an appropriate follow-up question.
* Ambiguous information triggers a clarification request before a search can run.
* Unknown teams or players produce a clear not-found message without running a search.
* The user does not need to provide a player's full name if the provided input uniquely identifies that player.
* If multiple players match the provided name, the assistant presents the matching players and their teams and asks the user to clarify which player they mean.
* Trades are limited to two teams: the user's team receives only the target player and sends one to three players.
* If the target player already belongs to the user's team, no search is performed and the assistant clearly informs the user that the player is already on their roster and cannot be acquired through a trade.
* Once the team and target player are valid and unambiguous, the assistant reflects the understood criteria and asks for confirmation before running the trade search.
* No trade search is performed until the user confirms the criteria.
* The user can change their team or target player. The current criteria are updated, any previous confirmation is invalidated, and the assistant asks for confirmation again before running a new search.
* Only valid trades are displayed, and the user is clearly informed if none exist.
* Results follow the defined default ordering (more information in Default Result Order section).
* Up to 9 results are shown initially, with more available through **Show more**.

## Out of Scope

The MVP does not include:

* Trades involving more than two teams
* Trade packages with more than three outgoing players
* Draft picks, free agents, or sign-and-trades
* Ranking trades by basketball value
* Explanations for rejected trades
* Manipulating an existing result set through commands such as sorting by age

The MVP focuses only on valid two-team player packages that acquire a specific requested player.

## GUI Mirror

The visual UI reflects the same information as the chat.

It shows:

* The user's selected team
* The target player
* The trade results for the current search

Both the chat and the visual UI use the same underlying data to stay consistent.

When the criteria change, both the chat and visual UI reflect the updated state.

## Results UX

The system initially displays up to **9 trade cards** to keep the layout clear and easy to scan.

If more results exist, **Show more** reveals up to 9 additional existing results without running the search again.

Each trade result is displayed as a separate card. At the top of the card, the option number is displayed, for example **Option #1**.
Each trade card shows:

* Players the user's team gives, including name, position, and salary
* The target player the user's team receives, with name, position, and salary
* Opposing team
* Net salary change
* Valid trade indication

The card visually separates the two teams. Each team's primary color is used as a visual emphasis, such as in the border or header of its section, to make the two sides easy to distinguish.

Net salary change is:

`total outgoing salary - target player's salary`

A positive value means the user's team reduces payroll, while a negative value means the user's team adds payroll.

* If the value is positive, the card displays **Saved $X** in green.
* If the value is negative, the card displays **Added $X** to payroll in red.
* If the value is zero, the card displays **No salary change**.

### Design Rationale

Because the goal is winning a championship, salary savings are not the primary objective. The MVP therefore prioritizes simpler packages that require the user's team to give up fewer players.

The system does not attempt to determine which trade is better from a basketball perspective.

### Default Result Order

Results prioritize simpler trade packages:

1. **1-for-1 trades**
2. **2-for-1 trades**
3. **3-for-1 trades**

Within packages of the same size, results are ordered by the closest salary match:

`|total outgoing salary - target player's salary|`

Options with a value closer to zero are shown first.

This ordering is only used to organize the results and should not be interpreted as a ranking of which trade is better from a basketball perspective.

## Risks to Verify

* The roster data is synthetic, so a requested real-world player may be missing or assigned to an unexpected team.
