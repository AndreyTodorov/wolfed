# Wolfed - Game Rules & Logic Documentation

## 1. Core Concepts

- **Roles:** 42 unique roles.
- **Teams:**
  - **Village (Good - Blue):** Win by banishing/killing all Evil characters.
  - **Evil (Red - Werewolves, Vampires, etc.):** Win when their number equals or exceeds Good characters (or specific role win conditions).
  - **Neutral/Solo:** Have specific personal win conditions (e.g., Jester, Assassin).
- **Cycles:** The game loops between **Night** (Abilities used) and **Day** (Discussion and Voting).
- **Magical vs. Physical:** Attacks are classified. Bodyguard protects against Physical, not Magical.

## 2. Game Phasing

### Phase 0: Setup

- Moderator selects participating roles based on player count.
- Moderator selects Event Cards (optional).
- Cards are dealt.
- **Mayor Election:** Can happen immediately or after the first death (rules vary, but app should support assigning a Mayor).

### Phase 1: The Night

- Players close eyes.
- Moderator wakes up roles in a specific **chronological order** (see Section 4).
- Roles perform actions (Kill, Save, Check, Silence, etc.).
- **Silence:** Moderator communicates silently (tapping/pointing).

### Phase 2: The Morning (Resolution)

- Moderator announces deaths.
- **Butcher Exception:** If Butcher hides a body, death is announced but role/card is NOT revealed.
- **Hunter Exception:** If Hunter dies, they immediately shoot someone.
- **Old Man Exception:** If Old Man dies (2nd time or by specific killer), Good team loses abilities.

### Phase 3: The Day

- **Discussion:** Timed or untimed.
- **Silence Effects:** Players silenced by Dentist/Hag cannot speak.
- **Voting:** Players vote to banish.
  - **Mayor:** Tie-breaker (counts as 2 votes in a tie).
  - **Thief:** Steals a vote (Target cannot vote, Thief votes twice).
  - **Sir Lengthily:** Can force a 1v1 duel instead of standard voting.
- **Defense:** Nominees defend themselves.
- **Banishment:** Player with most votes dies. Card revealed (unless turned upside down by mechanics).

## 3. Role Logic & Abilities

### The Werewolves (Evil)

- **Standard Werewolf:** Wake together. Choose 1 victim per night. Physical Attack.
- **Alpha Wolf:** Kills twice (once with pack, once alone). Can kill other WW. Win con: Last survivor (or with Nosferatu).
- **Leper (Good):** Passive. If attacked by WW, WW skip killing the _next_ night.

### The Killers & Attackers

- **Vampire:** Kills every _second_ night.
- **Nosferatu:** Kills every _second_ night (starting night 2). Solo win condition.
- **Hunter:** On death, selects 1 player to kill immediately.
- **Assassin:** Wakes with WW night 1 (visual only). Wins if WW win + he survives, or 1v1 with a Good character. Kills target if he is Banished.
- **Sorceress:** 1 Kill potion, 1 Save potion per game.
- **Dog Breeder:** If killed, 1 random WW dies next day.

### The Protectors & Healers

- **Bodyguard:** Protects 1 player/night from Physical attacks. Cannot pick self.
- **Herbalist:** Protects 1 player/night from WW. Cannot pick same person twice in a row.
- **Doctor / Wagon Driver:** Redirects attack from Player A to Player B.
- **Miner:** Immune to Night kills. Can only be banished.
- **Lawyer:** Selects player at night. If that player is voted to be banished next day, they are saved.
- **Hero:** Survives 1 attack. Can sacrifice self for others.

### The Seers & Info Gatherers

- **Seer:** Checks 1 card/night.
- **Little Girl:** Peeks while WW are awake.
- **Witch Hunter:** Checks alignment (Good/Evil) only.
- **Miss Rose:** Known evil players are pointed out to her night 1.
- **Watcher:** Chooses a player, learns who interacted with them.
- **Prophet:** Villager until Seer dies, then becomes Seer.
- **Dark Seer (Evil):** Checks identity. Helps WW.

### The Manipulators (Magic/Status)

- **Gypsy:** Links 2 Lovers Night 1. If one dies, both die.
- **Cupid / Bard:** Binds players. If all bound, Bard wins.
- **Dentist:** Silences 1 player (cannot speak next day).
- **Hag:** Silences 1 player's _Ability_ for the night.
- **Thief:** Steals vote (Target has 0, Thief has 2).
- **Shadow:** Links to a host. Dies if host dies.
- **Jester:** Guesses who is banished. Wins if correct 3 times.

### Special Residents

- **Old Man:** Has 2 lives. If he dies fully, ALL Good abilities are disabled.
- **Mayor:** 2 votes on tie.
- **Undertaker:** Asks dead player for 1-word clue.
- **Butcher:** Hides dead bodies (card not revealed).
- **Innkeeper:** If dead, Village has 3 days to win or they lose.

## 4. Night Turn Order (Crucial)

This order must be strictly followed by the app:

1.  **Hag** (Disable ability)
2.  **Gypsy, Master Villager, Miss Rose, Assassin, (Leper checks)**
3.  **Seer, Prophet, Witch Hunter**
4.  **Bard, Jester**
5.  **Wagon Driver**
6.  **Thief, Dentist, Sir Lengthily, Shadow**
7.  **Herbalist, Bodyguard, Lawyer**
8.  **Werewolves, Dark Seer, Alpha Wolf**
9.  **Vampire, Nosferatu**
10. **Sorceress**
11. **Hero**
12. **Butcher**
13. **Undertaker**
14. **Watcher**

## 5. Event Card Triggers

- **The Big Hunt:** Trap for WW.
- **Blood Moon:** Vampires can kill WW.
- **Silence:** Mayor chooses speakers.
- **Plague:** Leper infects half village.
- **The Mist:** Eyes closed for 3 cycles (Day/Night).
- **Elections:** Immediate Mayor vote.
- **Last Wish:** Dead vote for 1 living to die.
- **Death:** Roulette death (Mayor + Mod numbers).
- **The Long Night:** WW kill 2 instead of 1.
- **Villagers' Rage:** Master Villager banishes someone.
