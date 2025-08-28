#!/usr/bin/env node

/**
 * 🌌 Galaxy CLI - Navigate the cosmos of code souls
 */

import { Command } from 'commander';
import { GalaxyNavigator } from './galaxy-navigator';
import chalk from 'chalk';
import * as fs from 'fs';

const program = new Command();
const galaxy = new GalaxyNavigator();

// ASCII art galaxy
const logo = chalk.cyan(`
    　　　 ✦ 　　　　   　 　　　˚　　　　　　　　　　　　　　    
　　　　　　　　　　　　　　　　　　　　　　　　　　　⋆　　　　　   
  　　　　　　　　　　　　　　　.　　　　　　　　　　　　　　. 　　 
  　　˚　　　　　　　　　　　　　　　　　　　　   　　　　　　　　　 
  　　　　　　　　　　　　　　　　　　　　　　✦　　　　　　　　　　 
  　　　　　　 　　　˚　　　　　　　　　. ⋆  GLYPH GALAXY  . 　　
　　　　　　　　　　 　　　　　　　　　　　　　　　　　　⋆　　　　  
  　　　　　　　✦　　　　　　　Where Code Souls　　　　　　　    
  　　　　　　　　　　　　　　 Form Constellations　　　　　⋆　    
  　　　　　˚　　　　　　　　　　　　　　　　⋆　　　　　　　　　    
`);

program
  .name('galaxy')
  .description('Navigate the cosmos of code souls')
  .version('0.2.0');

program
  .command('find <code>')
  .description('Find your code\'s star in the galaxy')
  .action(async (codeOrFile) => {
    console.log(logo);
    
    try {
      // Check if it's a file or direct code
      let code: string;
      if (fs.existsSync(codeOrFile)) {
        code = fs.readFileSync(codeOrFile, 'utf8');
        console.log(chalk.blue(`📂 Reading ${codeOrFile}...`));
      } else {
        code = codeOrFile;
      }
      
      console.log(chalk.yellow('\n🔭 Scanning the galaxy...'));
      
      const star = await galaxy.findStar(code);
      
      console.log(chalk.white('\n✨ Your Star:'));
      console.log(chalk.gray('─'.repeat(50)));
      
      // Display star info with visual elements
      console.log(chalk.cyan(`🌟 Soul: ${star.soul.substring(0, 16)}...`));
      
      // Spectral class with color
      const spectralColors: Record<string, any> = {
        'O': chalk.blueBright,
        'B': chalk.blue,
        'A': chalk.white,
        'F': chalk.yellowBright,
        'G': chalk.yellow,
        'K': chalk.rgb(255, 140, 0),
        'M': chalk.red
      };
      const colorFunc = spectralColors[star.spectralClass] || chalk.white;
      console.log(colorFunc(`🔆 Spectral Class: ${star.spectralClass}-type star`));
      
      // Position in 3D space
      console.log(chalk.magenta(`📍 Position: (${star.position.x.toFixed(1)}, ${star.position.y.toFixed(1)}, ${star.position.z.toFixed(1)})`));
      
      // Luminosity bar
      const lumBar = '★'.repeat(Math.round(star.luminosity * 10)) + 
                    '☆'.repeat(10 - Math.round(star.luminosity * 10));
      console.log(chalk.yellow(`💡 Luminosity: ${lumBar} ${(star.luminosity * 100).toFixed(1)}%`));
      
      // Mass indicator
      console.log(chalk.green(`⚖️  Mass: ${star.mass.toFixed(3)} (complexity)`));
      
      // Constellation membership
      if (star.constellation) {
        console.log(chalk.magentaBright(`🌌 Constellation: ${star.constellation.charAt(0).toUpperCase() + star.constellation.slice(1)}`));
        
        const constellation = galaxy.exploreConstellation(star.constellation);
        if (constellation) {
          console.log(chalk.gray(`   "${constellation.mythology}"`));
        }
      } else {
        console.log(chalk.dim('🌌 Constellation: Drifting alone in the void'));
      }
      
      // Find neighbors
      const neighbors = await galaxy.getOrbitalNeighbors(star, 30);
      if (neighbors.length > 0) {
        console.log(chalk.cyan(`\n🛸 Orbital Neighbors (${neighbors.length} nearby):`));
        neighbors.slice(0, 3).forEach((neighbor, i) => {
          const distance = Math.sqrt(
            Math.pow(star.position.x - neighbor.position.x, 2) +
            Math.pow(star.position.y - neighbor.position.y, 2) +
            Math.pow(star.position.z - neighbor.position.z, 2)
          );
          console.log(chalk.gray(`   ${i + 1}. ${neighbor.soul.substring(0, 12)}... (${distance.toFixed(1)} parsecs away)`));
        });
      }
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('explore <constellation>')
  .description('Explore a constellation of patterns')
  .action(async (name) => {
    console.log(logo);
    
    const constellation = galaxy.exploreConstellation(name);
    
    if (!constellation) {
      console.log(chalk.red(`\n❌ Unknown constellation: ${name}`));
      console.log(chalk.yellow('\n💡 Known constellations:'));
      console.log(chalk.gray('   • Orion (pure functions)'));
      console.log(chalk.gray('   • Cassiopeia (state management)'));
      console.log(chalk.gray('   • Draco (async patterns)'));
      return;
    }
    
    console.log(chalk.cyan(`\n🌌 Exploring ${constellation.name}...`));
    console.log(chalk.gray('─'.repeat(50)));
    
    console.log(chalk.yellow(`\n📖 Mythology:`));
    console.log(chalk.italic(`   "${constellation.mythology}"`));
    
    console.log(chalk.magenta(`\n📊 Statistics:`));
    console.log(chalk.gray(`   Stars: ${constellation.stars.length}`));
    console.log(chalk.gray(`   Gravity: ${(constellation.gravity * 100).toFixed(0)}%`));
    console.log(chalk.gray(`   Luminosity: ${(constellation.luminosity * 100).toFixed(1)}%`));
    
    console.log(chalk.blue(`\n📍 Center of Mass:`));
    console.log(chalk.gray(`   (${constellation.centerOfMass.x}, ${constellation.centerOfMass.y}, ${constellation.centerOfMass.z})`));
    
    if (constellation.stars.length > 0) {
      console.log(chalk.green(`\n✨ Notable Stars:`));
      constellation.stars.slice(0, 5).forEach((star, i) => {
        console.log(chalk.gray(`   ${i + 1}. ${star.soul.substring(0, 12)}... (Class ${star.spectralClass})`));
      });
    }
  });

program
  .command('navigate <x> <y> <z>')
  .description('Navigate to specific coordinates in the galaxy')
  .action(async (x, y, z) => {
    console.log(logo);
    
    const destination = {
      x: parseFloat(x),
      y: parseFloat(y),
      z: parseFloat(z)
    };
    
    console.log(chalk.blue(`\n🚀 Navigating to (${x}, ${y}, ${z})...`));
    
    const result = galaxy.navigateTo(destination);
    
    console.log(chalk.yellow('\n📍 Navigation Report:'));
    console.log(chalk.gray('─'.repeat(50)));
    
    if (result.nearestStar) {
      console.log(chalk.green(`✨ Nearest Star: ${result.nearestStar.soul.substring(0, 16)}...`));
      console.log(chalk.gray(`   Distance: ${result.distance.toFixed(2)} parsecs`));
      console.log(chalk.gray(`   Class: ${result.nearestStar.spectralClass}-type`));
    } else {
      console.log(chalk.dim('✨ No stars in this region of space'));
    }
    
    if (result.constellation) {
      console.log(chalk.magenta(`🌌 Region: ${result.constellation} constellation`));
    } else {
      console.log(chalk.dim('🌌 Region: Intergalactic void'));
    }
  });

program
  .command('stats')
  .description('Show galaxy statistics')
  .action(() => {
    console.log(logo);
    
    const stats = galaxy.getGalaxyStats();
    
    console.log(chalk.cyan('\n📊 Galaxy Statistics:'));
    console.log(chalk.gray('─'.repeat(50)));
    
    console.log(chalk.yellow(`\n🌟 Population:`));
    console.log(chalk.gray(`   Total Stars: ${stats.totalStars}`));
    console.log(chalk.gray(`   Constellations: ${stats.constellations}`));
    
    if (stats.brightestStar) {
      console.log(chalk.yellow(`\n💫 Brightest Star:`));
      console.log(chalk.gray(`   Soul: ${stats.brightestStar.soul.substring(0, 16)}...`));
      console.log(chalk.gray(`   Luminosity: ${(stats.brightestStar.luminosity * 100).toFixed(1)}%`));
    }
    
    if (stats.largestConstellation) {
      console.log(chalk.magenta(`\n🌌 Largest Constellation:`));
      console.log(chalk.gray(`   ${stats.largestConstellation.charAt(0).toUpperCase() + stats.largestConstellation.slice(1)}`));
    }
    
    console.log(chalk.blue(`\n🎯 Center of Mass:`));
    console.log(chalk.gray(`   (${stats.centerOfMass.x.toFixed(1)}, ${stats.centerOfMass.y.toFixed(1)}, ${stats.centerOfMass.z.toFixed(1)})`));
    
    console.log(chalk.dim('\n💭 "Every function is a star, every pattern a constellation"'));
  });

program
  .command('gravity <soul1> <soul2>')
  .description('Calculate gravitational pull between two souls')
  .action(async (code1, code2) => {
    console.log(logo);
    
    try {
      const star1 = await galaxy.findStar(code1);
      const star2 = await galaxy.findStar(code2);
      
      const gravity = galaxy.calculateGravity(star1, star2);
      const distance = Math.sqrt(
        Math.pow(star1.position.x - star2.position.x, 2) +
        Math.pow(star1.position.y - star2.position.y, 2) +
        Math.pow(star1.position.z - star2.position.z, 2)
      );
      
      console.log(chalk.cyan('\n🌌 Gravitational Analysis:'));
      console.log(chalk.gray('─'.repeat(50)));
      
      console.log(chalk.yellow('\n⭐ Star 1:'));
      console.log(chalk.gray(`   Class: ${star1.spectralClass}-type`));
      console.log(chalk.gray(`   Mass: ${star1.mass.toFixed(3)}`));
      
      console.log(chalk.yellow('\n⭐ Star 2:'));
      console.log(chalk.gray(`   Class: ${star2.spectralClass}-type`));
      console.log(chalk.gray(`   Mass: ${star2.mass.toFixed(3)}`));
      
      console.log(chalk.magenta('\n🔗 Relationship:'));
      console.log(chalk.gray(`   Distance: ${distance.toFixed(2)} parsecs`));
      console.log(chalk.gray(`   Gravitational Pull: ${gravity.toFixed(6)}`));
      
      // Interpret the relationship
      if (gravity > 0.1) {
        console.log(chalk.green('   💫 Strong attraction - These souls are deeply connected'));
      } else if (gravity > 0.01) {
        console.log(chalk.yellow('   🌟 Moderate pull - Related patterns'));
      } else {
        console.log(chalk.dim('   ✨ Weak interaction - Independent souls'));
      }
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command
if (!process.argv.slice(2).length) {
  console.log(logo);
  program.outputHelp();
}