using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterMovement : MonoBehaviour
{
    public Rigidbody rb;
    public float accel = 400.0f;
    public float maxSpeedWalk = 2.0f;
    public float maxSpeedRun = 5.0f;
    public float rotateSpeed = 2.0f;
    public float jumpForce = 5.0f;

    public Animator anim;

    private bool isGrounded = true;
    private int state = 0;

    void FixedUpdate()
    {
        Vector3 moveInput = Vector3.zero;

        // --- Ruch do przodu i tyłu ---
        if (Input.GetKey(KeyCode.W))
            moveInput.z += 1;
        if (Input.GetKey(KeyCode.S))
            moveInput.z -= 1;

        // --- Obrót ---
        float turn = 0;
        if (Input.GetKey(KeyCode.A))
            turn = -1;
        if (Input.GetKey(KeyCode.D))
            turn = 1;

        transform.Rotate(0, turn * rotateSpeed, 0);

        // --- Przemiana lokalnego ruchu na globalny ---
        Vector3 moveDir = transform.TransformDirection(moveInput.normalized);
        float speed = Input.GetKey(KeyCode.LeftShift) ? maxSpeedRun : maxSpeedWalk;

        rb.AddForce(moveDir * accel * Time.deltaTime);

        // --- Ograniczenie prędkości ---
        Vector3 vel = rb.linearVelocity;
        Vector3 flatVel = new Vector3(vel.x, 0, vel.z);

        if (flatVel.magnitude > speed)
        {
            flatVel = flatVel.normalized * speed;
            rb.linearVelocity = new Vector3(flatVel.x, vel.y, flatVel.z);
        }

        // --- Skakanie ---
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            isGrounded = false;
            state = 5; // jump-up
            anim.SetInteger("State", state);
            return; // Przerywamy, by nie nadpisać animacji skoku
        }

        // --- Stan animacji ---
        float horizontalVel = new Vector3(rb.linearVelocity.x, 0, rb.linearVelocity.z).magnitude;

        if (!isGrounded)
        {
            state = 5; // jump
        }
        else if (horizontalVel < 0.1f)
        {
            state = 0; // idle
        }
        else
        {
            bool isRunning = Input.GetKey(KeyCode.LeftShift);

            if (Input.GetKey(KeyCode.W))
                state = isRunning ? 2 : 1; // run or walk
            else if (Input.GetKey(KeyCode.S))
                state = isRunning ? 4 : 3; // backward run or walk
        }

        anim.SetInteger("State", state);
    }

    // Wykrywanie kontaktu z podłożem
    private void OnCollisionStay(Collision collision)
    {
        // Sprawdź, czy dotykamy podłoża (tag, warstwa lub cokolwiek logicznego)
        if (collision.contacts.Length > 0)
        {
            ContactPoint contact = collision.contacts[0];
            if (Vector3.Dot(contact.normal, Vector3.up) > 0.5f)
                isGrounded = true;
        }
    }

    private void OnCollisionExit(Collision collision)
    {
        isGrounded = false;
    }
}
