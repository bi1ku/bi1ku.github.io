.data
	__bik_var_WKKYHIDDQSCDXRJM: .asciiz "ready for battle"
	__bik_var_hero_name: .asciiz "paladin"
	__bik_var_hero_health: .word 75
	__bik_var_hero_power: .word 20
	__bik_var_hero_armor: .word 10
	__bik_var_backup_name: .asciiz "paladin"
	__bik_var_backup_health: .word 180
	__bik_var_backup_power: .word 20
	__bik_var_backup_armor: .word 10
	__bik_var_mage_name: .asciiz "mage"
	__bik_var_mage_health: .word 100
	__bik_var_mage_power: .word 30
	__bik_var_mage_armor: .word 3
	__bik_var_mage_mana: .word 80
	__bik_var_enemy_name: .asciiz "wanderer"
	__bik_var_enemy_health: .word 0
	__bik_var_enemy_power: .word 12
	__bik_var_enemy_armor: .word 3
	__bik_var_ORELLNMPAPQFWKHO: .asciiz ": "
	__bik_var_PKMCOQHNWNKUEWHS: .asciiz "\nhealth: "
	__bik_var_DKQTBXIXMVTRRBLJ: .asciiz ", armor: "
	__bik_var_VFRKMLNOZJKPQPXR: .asciiz "\nenemy after paladin strike: "
	__bik_var_EWHTACIOHORDTQKV: .asciiz "\nenemy after mage strike: "
	__bik_var_WNNYQXNZLGDGWPBT: .asciiz "\nindependent health: "
	__bik_var_CDRUBETOKYXHOACH: .asciiz " / "
	__bik_var_TUKWAGMLEJUUKWCI: .asciiz "\nmage mana: "
	__bik_var_YDIAJXLOGHIQFMZH: .asciiz "\n"

.text
.globl main
main:
	li $t0, 180
	sw $t0, __bik_var_hero_health
	li $t0, 20
	sw $t0, __bik_var_hero_power
	li $t0, 10
	sw $t0, __bik_var_hero_armor
	li $t0, 180
	sw $t0, __bik_var_backup_health
	li $t0, 20
	sw $t0, __bik_var_backup_power
	li $t0, 10
	sw $t0, __bik_var_backup_armor
	li $t0, 100
	sw $t0, __bik_var_mage_health
	li $t0, 30
	sw $t0, __bik_var_mage_power
	li $t0, 3
	sw $t0, __bik_var_mage_armor
	li $t0, 80
	sw $t0, __bik_var_mage_mana
	li $t0, 100
	sw $t0, __bik_var_enemy_health
	li $t0, 12
	sw $t0, __bik_var_enemy_power
	li $t0, 3
	sw $t0, __bik_var_enemy_armor
	li $v0, 4
	la $a0, __bik_var_hero_name
	syscall
	li $v0, 4
	la $a0, __bik_var_ORELLNMPAPQFWKHO
	syscall
	jal __bik_func_Paladin_banner
	nop
	move $t0, $v0
	li $v0, 4
	la $a0, __bik_var_PKMCOQHNWNKUEWHS
	syscall
	lw $t0, __bik_var_hero_health
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_DKQTBXIXMVTRRBLJ
	syscall
	lw $t0, __bik_var_hero_armor
	li $v0, 1
	move $a0, $t0
	syscall
	lw $t0, __bik_var_enemy_health
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	addiu $sp, $sp, -8
	lw $t0, __bik_var_hero_power
	sw $t0, 0($sp)
	lw $t0, __bik_var_enemy_armor
	sw $t0, 4($sp)
	lw $a0, 0($sp)
	lw $a1, 4($sp)
	jal __bik_func_Paladin_damage
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	sw $t0, __bik_var_enemy_health
	li $v0, 4
	la $a0, __bik_var_VFRKMLNOZJKPQPXR
	syscall
	lw $t0, __bik_var_enemy_health
	li $v0, 1
	move $a0, $t0
	syscall
	lw $t0, __bik_var_enemy_health
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	addiu $sp, $sp, -8
	lw $t0, __bik_var_mage_power
	sw $t0, 0($sp)
	lw $t0, __bik_var_enemy_armor
	sw $t0, 4($sp)
	lw $a0, 0($sp)
	lw $a1, 4($sp)
	jal __bik_func_Mage_damage
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	sw $t0, __bik_var_enemy_health
	li $v0, 4
	la $a0, __bik_var_EWHTACIOHORDTQKV
	syscall
	lw $t0, __bik_var_enemy_health
	li $v0, 1
	move $a0, $t0
	syscall
	li $t0, 75
	sw $t0, __bik_var_hero_health
	li $v0, 4
	la $a0, __bik_var_WNNYQXNZLGDGWPBT
	syscall
	lw $t0, __bik_var_hero_health
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_CDRUBETOKYXHOACH
	syscall
	lw $t0, __bik_var_backup_health
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_TUKWAGMLEJUUKWCI
	syscall
	lw $t0, __bik_var_mage_mana
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_YDIAJXLOGHIQFMZH
	syscall
	li $v0, 10
	syscall
__bik_func_Character_damage:
	addiu $sp, $sp, -16
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	sw $a0, 8($fp)
	sw $a1, 12($fp)
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	lw $t0, 12($fp)
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	move $v0, $t0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
__bik_func_Character_banner:
	addiu $sp, $sp, -8
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	li $v0, 4
	la $a0, __bik_var_WKKYHIDDQSCDXRJM
	syscall
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 8
	jr $ra
	nop
__bik_func_Warrior_damage:
	addiu $sp, $sp, -16
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	sw $a0, 8($fp)
	sw $a1, 12($fp)
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 2
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	mult $t0, $t1
	mflo $t0
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	lw $t0, 12($fp)
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	move $v0, $t0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
__bik_func_Warrior_banner:
	addiu $sp, $sp, -8
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	li $v0, 4
	la $a0, __bik_var_WKKYHIDDQSCDXRJM
	syscall
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 8
	jr $ra
	nop
__bik_func_Paladin_damage:
	addiu $sp, $sp, -16
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	sw $a0, 8($fp)
	sw $a1, 12($fp)
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 2
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	mult $t0, $t1
	mflo $t0
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	lw $t0, 12($fp)
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	move $v0, $t0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
__bik_func_Paladin_banner:
	addiu $sp, $sp, -8
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	li $v0, 4
	la $a0, __bik_var_WKKYHIDDQSCDXRJM
	syscall
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 8
	jr $ra
	nop
__bik_func_Mage_damage:
	addiu $sp, $sp, -16
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	sw $a0, 8($fp)
	sw $a1, 12($fp)
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	lw $t0, 12($fp)
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	move $v0, $t0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
__bik_func_Mage_banner:
	addiu $sp, $sp, -8
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	li $v0, 4
	la $a0, __bik_var_WKKYHIDDQSCDXRJM
	syscall
	li $v0, 0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 8
	jr $ra
	nop
