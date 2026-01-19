package com.example.demo.Controller;


import com.example.demo.model.Adventurer;
import com.example.demo.model.Item;
import com.example.demo.model.Quests;
import com.example.demo.model.Monster;
import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class PageController {
    private final List<Adventurer> adventurers = new ArrayList<>();
    private final List<Quests> quests = new ArrayList<>();
    private final List<Monster> monsters = new ArrayList<>();

    @PostConstruct
    public void init(){

        adventurers.add(new Adventurer("Monke", "mage", 25, "one handed sword", 100, 50, new ArrayList<>()));
        adventurers.add(new Adventurer("Monke2", "warrior", 15, "axe of racism", 150, 40, new ArrayList<>()));
        adventurers.add(new Adventurer("Draemor", "conjurer", 60, "bound weapons", 200, 120, new ArrayList<>()));
        adventurers.add(new Adventurer("Dar'sha", "thief", 20, "one handed sword", 90, 70, new ArrayList<>()));


        quests.add(new Quests("Assassination", "Assassinate the local duke", 40));
        quests.add(new Quests("Protection", "Escort the Emperor", 50));
        quests.add(new Quests("Destruction", "Destroy bandit camps", 20));

        monsters.add(new Monster("Draugr", 5, 40, 5));
        monsters.add(new Monster("Giant", 22, 120, 35));
        monsters.add(new Monster("Ancient dragon", 55, 500, 85));
    }

    @GetMapping("/home")
    public List<Adventurer> homePage(){
        return  adventurers;
    }

    @GetMapping("/quests")
    public List<Quests> questsPage(){
        return quests;
    }
    @GetMapping("/monsters")
    public List<Monster> monstersPage(){
        return monsters;
    }

    @PostMapping("/add-adventurer")
    public String addAdventurer(@RequestBody Adventurer newAdventurer) {
        adventurers.add(newAdventurer);
        return "Adventurer added successfully!";
    }
    @PostMapping("/add-quest")
    public String addQuest(@RequestBody Quests newQuest) {
        quests.add(newQuest);
        return "Adventurer added successfully!";
    }

    @PostMapping("/adventurer/{name}/add-item")
    public String addItem(@PathVariable String name, @RequestBody Item newItem) {
        for (Adventurer a : adventurers) {
            if (a.getName().equalsIgnoreCase(name)) {
                a.getInventory().add(newItem);
                return "Successfully added " + newItem.getItemName() + " to " + name + "'s inventory!";
            }
        }
        return "Adventurer not found!";
    }

    @PostMapping("/update-hp/{name}/{newHp}")
    public String updateAdventurerHp(@PathVariable String name, @PathVariable int newHp) {
        adventurers.stream()
                .filter(a -> a.getName().equalsIgnoreCase(name))
                .findFirst()
                .ifPresent(a -> a.setHp(newHp));
        return "Health updated on server.";
    }

    @DeleteMapping("/remove-quest/{name}")
    public String removeQuest(@PathVariable String name) {
        boolean removed = quests.removeIf(q -> q.getName().equalsIgnoreCase(name));
        if (removed) {
            return "Quest '" + name + "' removed successfully!";
        } else {
            return "Quest not found.";
        }
    }

    @DeleteMapping("/adventurer/{advName}/remove-item/{itemName}")
    public String removeItem(@PathVariable String advName, @PathVariable String itemName) {
        for (Adventurer a : adventurers) {
            if (a.getName().equalsIgnoreCase(advName)) {
                boolean removed = a.getInventory().removeIf(item -> item.getItemName().equalsIgnoreCase(itemName));
                return removed ? "Item removed." : "Item not found in inventory.";
            }
        }
        return "Adventurer not found.";
    }
}
