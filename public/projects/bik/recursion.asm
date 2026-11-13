.data
	__bik_var_QCOENDTOMFGDWDWF: .asciiz " "
	__bik_var_WCSGSPQOQMSBOAGU: .asciiz " "
	__bik_var_WDVMXXRDRYXLMNDQ: .asciiz "\n"

.text
.globl main
main:
	addiu $sp, $sp, -8
	li $t0, 7
	sw $t0, 0($sp)
	lw $a0, 0($sp)
	jal __bik_func_factorial
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_QCOENDTOMFGDWDWF
	syscall
	addiu $sp, $sp, -8
	li $t0, 12
	sw $t0, 0($sp)
	lw $a0, 0($sp)
	jal __bik_func_fibonacci
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_WCSGSPQOQMSBOAGU
	syscall
	addiu $sp, $sp, -8
	li $t0, 1071
	sw $t0, 0($sp)
	li $t0, 462
	sw $t0, 4($sp)
	lw $a0, 0($sp)
	lw $a1, 4($sp)
	jal __bik_func_gcd
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	li $v0, 1
	move $a0, $t0
	syscall
	li $v0, 4
	la $a0, __bik_var_WDVMXXRDRYXLMNDQ
	syscall
	li $v0, 10
	syscall
__bik_func_factorial:
	addiu $sp, $sp, -16
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	sw $a0, 8($fp)
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 1
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	bgt $t0, $t1, if_end_0
	nop
	li $t0, 1
	move $v0, $t0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
if_end_0:
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	addiu $sp, $sp, -8
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 1
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	sw $t0, 0($sp)
	lw $a0, 0($sp)
	jal __bik_func_factorial
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	mult $t0, $t1
	mflo $t0
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
__bik_func_fibonacci:
	addiu $sp, $sp, -16
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	sw $a0, 8($fp)
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 2
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	bge $t0, $t1, if_end_1
	nop
	lw $t0, 8($fp)
	move $v0, $t0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
if_end_1:
	addiu $sp, $sp, -8
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 1
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	sw $t0, 0($sp)
	lw $a0, 0($sp)
	jal __bik_func_fibonacci
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	addiu $sp, $sp, -8
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 2
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	subu $t0, $t0, $t1
	sw $t0, 0($sp)
	lw $a0, 0($sp)
	jal __bik_func_fibonacci
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	addu $t0, $t0, $t1
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
__bik_func_gcd:
	addiu $sp, $sp, -16
	sw $ra, 0($sp)
	sw $fp, 4($sp)
	move $fp, $sp
	sw $a0, 8($fp)
	sw $a1, 12($fp)
	lw $t0, 12($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	li $t0, 0
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	bne $t0, $t1, if_end_2
	nop
	lw $t0, 8($fp)
	move $v0, $t0
	move $sp, $fp
	lw $ra, 0($sp)
	lw $fp, 4($sp)
	addiu $sp, $sp, 16
	jr $ra
	nop
if_end_2:
	addiu $sp, $sp, -8
	lw $t0, 12($fp)
	sw $t0, 0($sp)
	lw $t0, 8($fp)
	addiu $sp, $sp, -8
	sw $t0, 0($sp)
	lw $t0, 12($fp)
	move $t1, $t0
	lw $t0, 0($sp)
	addiu $sp, $sp, 8
	div $t0, $t1
	mfhi $t0
	sw $t0, 4($sp)
	lw $a0, 0($sp)
	lw $a1, 4($sp)
	jal __bik_func_gcd
	nop
	addiu $sp, $sp, 8
	move $t0, $v0
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
