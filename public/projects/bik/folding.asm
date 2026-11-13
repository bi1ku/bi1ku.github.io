.data
	__bik_var_answer: .word 36
	__bik_var_message: .asciiz "computed at compile time"
	__bik_var_WKKYHIDDQSCDXRJM: .asciiz "\n"
	__bik_var_RCBYNECDYGGXXPKL: .asciiz "\n"

.text
.globl main
main:
	li $t0, 7
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 5
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	addu $t0, $t0, $t1
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 3
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	mult $t0, $t1
	mflo $t0
	sw $t0, __bik_var_answer
	lw $t0, __bik_var_answer
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_WKKYHIDDQSCDXRJM
	syscall
	li $v0, 4
	la $a0, __bik_var_message
	syscall
	li $v0, 4
	la $a0, __bik_var_RCBYNECDYGGXXPKL
	syscall
	li $v0, 10
	syscall
