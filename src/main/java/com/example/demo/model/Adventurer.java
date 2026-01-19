package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Adventurer {
    private String name;
    private String adventurerClass;
    private int level;
    private String weapon;
    private int hp;
    private int damage;

    private List<Item> inventory = new ArrayList<>();
}


