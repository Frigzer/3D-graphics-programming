using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CharacterMovement : MonoBehaviour
{
    public Rigidbody rb;
    public Animator anim;

    public float accel = 400.0f;
    public float maxWalkSpeed = 2.0f;
    public float maxRunSpeed = 4.0f;
    public float rotateSpeed = 1.0f;
    public float jumpForce = 4.0f;

    private Vector3 moveDirection = Vector3.zero;

    // Update is called once per frame
    void Update()
    {
        float vertical = Input.GetAxis("Vertical");
        float horizontal = Input.GetAxis("Horizontal");

        // Rotate player
        transform.Rotate(0, horizontal * rotateSpeed, 0);

        // Move forward/backward
        moveDirection = new Vector3(0, 0, vertical);
        moveDirection = transform.TransformDirection(moveDirection);

        float currentMaxSpeed = maxWalkSpeed;
        int state = 0;

        if (vertical > 0)
        {
            if (Input.GetKey(KeyCode.LeftShift))
            {
                state = 2; // run forward
                currentMaxSpeed = maxRunSpeed;
            }
            else
            {
                state = 1; // walk forward
            }
        }
        else if (vertical < 0)
        {
            if (Input.GetKey(KeyCode.LeftShift))
            {
                state = 4; // run backward
                currentMaxSpeed = maxRunSpeed;
            }
            else
            {
                state = 3; // walk backward
            }
        } 

        if (Input.GetKeyDown(KeyCode.Space))
        {
            Debug.Log("Skok");
            state = 5; // jump
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        }

        // Physical movement
        rb.AddForce(moveDirection * accel * Time.deltaTime);

        Vector3 vel = rb.linearVelocity;
        Vector3 horizontalVel = new Vector3(vel.x, 0, vel.z);

        if (horizontalVel.magnitude > currentMaxSpeed)
        {
            horizontalVel = horizontalVel.normalized * currentMaxSpeed;
            rb.linearVelocity = new Vector3(horizontalVel.x, vel.y, horizontalVel.z);
        }

        // Set state
        anim.SetInteger("State", state);
    }

}